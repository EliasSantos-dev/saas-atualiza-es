import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ required: true, unique: true })
  id: string; // ID do perfil para o App Desktop

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  auto_update: boolean;

  @Prop()
  source_url: string;

  @Prop({ default: 'SuaMusica' })
  source_type: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
