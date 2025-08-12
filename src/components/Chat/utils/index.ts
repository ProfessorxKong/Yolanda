import { ConversationRound } from '@/store/slices/chatNew';

export const isStreamRound = (round: ConversationRound): boolean => {
  return round.id.endsWith('stream');
};

export const isHumanRound = (round: ConversationRound): boolean => {
  return round.id.endsWith('human');
};
