import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema()
class FolderRule {
  @Prop()
  max_files: number;

  @Prop()
  link: string;
}

@Schema({ collection: 'configs', timestamps: true })
export class Config {
  @Prop({ required: true, unique: true })
  profile_id: string;

  @Prop({ default: 14.0 })
  max_size_gb: number;

  @Prop({ type: Object, default: {} })
  folder_rules: Record<string, FolderRule>;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
