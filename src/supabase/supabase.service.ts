import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_PROJECT_URL || '',
      process.env.SUPABASE_API_KEY_SERVICE_ROLE || process.env.SUPABASE_API_KEY || '',
    )
  }

  // TODO: Ver si esta bien que delete file sea un void

  /**
   * Obtiene el cliente de supabase inicializado.
   * @returns El cliente de supabase inicializado.
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * 📤 Sube un archivo al bucket de Supabase.
   * @param bucket - Nombre del bucket (ej: 'brands')
   * @param filePath - Ruta dentro del bucket (ej: 'logos/imagen.webp')
   * @param fileBuffer - Buffer del archivo
   * @param contentType - Tipo MIME del archivo (ej: 'image/webp')
   * @returns URL pública del archivo subido
   */
  async uploadFile(bucket: string, filePath: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const { data, error } = await this.supabase.storage.from(bucket).upload(filePath, fileBuffer, {
      cacheControl: '3600',
      upsert: false,
      contentType,
    });

    if (error) {
      console.error('Error al subir el archivo:', error.message);
      throw new Error('Error al subir el archivo');
    }

    return this.getPublicUrl(bucket, data.path);
  }

  /**
   * 🌍 Obtiene la URL pública de un archivo en Supabase.
   * @param bucket - Nombre del bucket (ej: 'brands')
   * @param filePath - Ruta dentro del bucket (ej: 'logos/imagen.webp')
   * @returns URL pública del archivo
   */
  getPublicUrl(bucket: string, filePath: string): string {
    return this.supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
  }

  /**
   * 🗑️ Elimina un archivo de Supabase Storage.
   * @param bucket - Nombre del bucket (ej: 'brands')
   * @param filePath - Ruta dentro del bucket (ej: 'logos/imagen.webp')
   */
  async deleteFile(bucket: string, filePath: string): Promise<void> {
    if (!filePath) throw new BadRequestException('No se proporcionó un archivo para eliminar.');

    const { error } = await this.supabase.storage.from(bucket).remove([filePath]);

    if (error) throw new Error(`Error al eliminar el archivo: ${error.message}`);
  }
}
