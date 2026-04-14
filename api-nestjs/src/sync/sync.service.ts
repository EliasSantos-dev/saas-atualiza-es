import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Snapshot, SnapshotDocument } from './schemas/snapshot.schema';

@Injectable()
export class SyncService {
  constructor(@InjectModel(Snapshot.name) private snapshotModel: Model<SnapshotDocument>) {}

  async getLatestSnapshot(profileId: string): Promise<Snapshot> {
    const snapshot = await this.snapshotModel.findOne(
      { profile_id: profileId },
      {},
      { sort: { created_at: -1 } }
    ).exec();

    if (!snapshot) {
      // Fallback to master_profile
      return this.snapshotModel.findOne(
        { profile_id: 'master_profile' },
        {},
        { sort: { created_at: -1 } }
      ).exec();
    }
    return snapshot;
  }

  calculateDelta(clientFiles: any[], serverFiles: any[]) {
    const clientByPath = new Map(clientFiles.map(f => [f.path, f]));
    const serverByPath = new Map(serverFiles.map(f => [f.path, f]));
    
    const clientByHash = new Map();
    clientFiles.forEach(f => {
      if (!clientByHash.has(f.hash)) clientByHash.set(f.hash, []);
      clientByHash.get(f.hash).push(f);
    });

    const toDownload = [];
    const toDelete = [];
    const toRename = [];
    const usedClientPaths = new Set();

    // 1. Process server files
    for (const [path, serverFile] of serverByPath.entries()) {
      const clientFile = clientByPath.get(path);

      if (clientFile && clientFile.hash === serverFile.hash) {
        usedClientPaths.add(path);
        continue;
      }

      const possibleRenames = clientByHash.get(serverFile.hash) || [];
      let foundRename = false;
      for (const pRename of possibleRenames) {
        if (!usedClientPaths.has(pRename.path) && !serverByPath.has(pRename.path)) {
          toRename.push({
            old_path: pRename.path,
            new_path: path
          });
          usedClientPaths.add(pRename.path);
          foundRename = true;
          break;
        }
      }

      if (!foundRename) {
        toDownload.push(serverFile);
      }
    }

    // 2. Process deletions
    for (const path of clientByPath.keys()) {
      if (!usedClientPaths.has(path)) {
        toDelete.push(path);
      }
    }

    return { toDownload, toDelete, toRename };
  }
}
