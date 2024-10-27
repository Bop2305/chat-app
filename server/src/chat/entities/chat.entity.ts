import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participant } from './participant.entity';
import { Message } from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Participant, (participant) => participant.chat)
  participants: Participant[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
