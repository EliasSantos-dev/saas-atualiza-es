import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config, ConfigDocument } from './schemas/config.schema';
import { Snapshot, SnapshotDocument } from '../sync/schemas/snapshot.schema';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class ConstructorService {
  private readonly logger = new Logger(ConstructorService.name);

  constructor(
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
    @InjectModel(Snapshot.name) private snapshotModel: Model<SnapshotDocument>,
  ) {}

  async getConfig(profileId: string): Promise<Config> {
    let config = await this.configModel.findOne({ profile_id: profileId }).exec();
    if (!config) {
      config = new this.configModel({ profile_id: profileId });
    }
    return config;
  }

  async updateConfig(profileId: string, data: Partial<Config>): Promise<void> {
    await this.configModel.updateOne(
      { profile_id: profileId },
      { $set: data },
      { upsert: true },
    ).exec();
  }

  private generateHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  }

  async buildManifest(rootDir: string, profileId: string, version: string): Promise<any> {
    const config = await this.getConfig(profileId);
    const maxSizeGb = config.max_size_gb || 14.0;
    const folderRules = config.folder_rules || {};
    const maxSizeBytes = maxSizeGb * 1024 * 1024 * 1024;
    let currentSize = 0;

    const manifest = {
      profile_id: profileId,
      version: version,
      files: [],
      folder_links: {},
      created_at: new Date(),
    };

    if (!fs.existsSync(rootDir)) {
      this.logger.error(`Diretório ${rootDir} não encontrado`);
      return null;
    }

    const items = fs.readdirSync(rootDir);
    for (const folderName of items.sort()) {
      const folderPath = path.join(rootDir, folderName);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const rule = folderRules[folderName] || {};
      manifest.folder_links[folderName] = rule.link || `https://download.pulsedrive.com/v1/${folderName.replace(/ /g, '_')}`;

      const maxFiles = rule.max_files;
      const filesInFolder = [];

      const walk = (dir) => {
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat && stat.isDirectory()) {
            walk(fullPath);
          } else if (file.endsWith('.mp3')) {
            filesInFolder.push({
              fullPath,
              mtime: stat.mtimeMs,
              size: stat.size,
            });
          }
        });
      };

      walk(folderPath);
      filesInFolder.sort((a, b) => b.mtime - a.mtime);

      const limitedFiles = maxFiles ? filesInFolder.slice(0, maxFiles) : filesInFolder;

      for (const fInfo of limitedFiles) {
        if (currentSize + fInfo.size > maxSizeBytes) {
          this.logger.warn(`Limite de ${maxSizeGb}GB atingido.`);
          break;
        }

        const relPath = path.relative(rootDir, fInfo.fullPath).replace(/\\/g, '/');
        const hash = this.generateHash(fInfo.fullPath);

        manifest.files.push({
          path: relPath,
          hash: hash,
          size: fInfo.size,
        });
        currentSize += fInfo.size;
      }
    }

    return manifest;
  }

  async generateMasterSnapshot(): Promise<any> {
    const rootDir = "16gb_atualizacao_marco_2026_vol.01_(Sem_Vinheta)_@kelcds";
    const profileId = "master_profile";
    const version = `v1.0.${Math.floor(Date.now() / 1000)}`;

    const manifest = await this.buildManifest(rootDir, profileId, version);
    if (!manifest) return null;

    const newSnapshot = new this.snapshotModel(manifest);
    await newSnapshot.save();

    return {
      message: "Snapshot Mestre gerado com sucesso",
      total_files: manifest.files.length,
      version: manifest.version,
    };
  }
}
