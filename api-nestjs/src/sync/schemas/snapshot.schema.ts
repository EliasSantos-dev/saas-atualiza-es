import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SnapshotDocument = Snapshot & Document;

@Schema({ collection: 'snapshots' })
export class FileEntry {
  @Prop()
  path: string;

  @Prop()
  hash: string;

  @Prop()
  size: number;
}

@Schema({ timestamps: true })
export class Snapshot {
  @Prop({ required: true })
  profile_id: string;

  @Prop({ required: true })
  version: string;

  @Prop({ type: [FileEntry], default: [] })
  files: FileEntry[];

  @Prop({ type: Object, default: {} })
  folder_links: Record<string, string>;
}

export const SnapshotSchema = SchemaFactory.createForClass(Snapshot);
