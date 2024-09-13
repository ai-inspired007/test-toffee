import { Message } from "ai";
import { Character as BaseCharacterProps, Message as BaseMessage, KnowledgePack as BaseKnowledgePack, Tag, Category as BaseCategory, UserSettings, Voice as BaseVoice, CharacterKnowledgePack } from "@prisma/client";
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
  characterKnowledgePacks: CharacterKnowledgePack[]
}

export interface TKnowledgePack extends BaseKnowledgePack {
  tags: Tag[];
  theme: null;
}

export interface TCategory extends BaseCategory {
  characters: BaseCharacterProps[]
}

export type ScoredCharacter = TCharacter & { score: number };

export interface User extends UserSettings {
  characterCount: number
}

export interface TVoice extends BaseVoice {
  tags: Tag[];
}

export type TopOne = {
  type: string;
  data: TCharacter | TKnowledgePack | Tag | TVoice;
  character?: TCharacter;
  candy?: TKnowledgePack;
  tag?: Tag;
  voice?: TVoice;
};