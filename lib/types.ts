import { Message } from "ai";
import { Character as BaseCharacterProps, Message as BaseMessage, KnowledgePack as BaseKnowledgePack, Tag, Category as BaseCategory, UserSettings } from "@prisma/client";
export interface MessageMetadata extends Partial<Message> {
  start?: number;
  response?: number;
  end?: number;
  ttsModel?: string;
}
export interface TCharacter extends BaseCharacterProps {
  messages: Message[];
  category: TCategory | null;
  tags: Tag[];
  _count: {
    messages: number;
  };
}

export interface TKnowledgePack extends BaseKnowledgePack {
  tags: Tag[];
}
export interface TCategory extends BaseCategory {
  characters: BaseCharacterProps[]
}

export type ScoredCharacter = TCharacter & { score: number };

export interface User extends UserSettings {
  characterCount: number
}

export type TopOne = {
  type: string;
  data: TCharacter | TKnowledgePack | Tag;
  character?: TCharacter;
  candy?: TKnowledgePack;
  tag?: Tag;
};