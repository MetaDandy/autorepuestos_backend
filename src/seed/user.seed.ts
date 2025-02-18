import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly supabaseService: SupabaseService,
  ) { }

  async syncAdminUser() {
    const existingUser = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });

    if (existingUser) {
      console.log('⚠️ El usuario Admin ya existe.');
      return;
    }

    const adminRole = await this.roleRepository.findOne({ where: { name: 'Admin' } });

    if (!adminRole) {
      console.error('❌ No se encontró el rol "Admin". Ejecuta primero los seeders de permisos y roles.');
      return;
    }

    // 🔹 Crear usuario en Supabase
    const { data, error } = await this.supabaseService.getClient().auth.admin.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      email_confirm: true, // Confirma el email automáticamente
    });

    if (error) {
      console.error('❌ Error creando usuario en Supabase:', error.message);
      return;
    }

    // 🔹 Guardar usuario en la base de datos local
    const newUser = this.userRepository.create({
      supabase_user_id: data.user.id,
      email: data.user.email,
      name: 'Administrador',
      phone: '77563321',
      address: '',
      role: adminRole,
    });

    await this.userRepository.save(newUser);
    console.log('✅ Usuario Admin creado correctamente.');
  }
}
