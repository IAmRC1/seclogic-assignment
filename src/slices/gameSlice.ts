import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const cards: string[] = ['cat', 'defuse', 'shuffle', 'explode']

const generateRandomCardType = (): string => {
  const randomIndex: number = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
};

type InitialState = {
  username: string;
  deck: {id: string, type: string}[];
  defusingCardCount: number;
  result: string;
  gamesWon: number;
  leaderboard: any[];
}

const initialState: InitialState = {
  username: '',
  deck: [],
  defusingCardCount: 0,
  result: '',
  gamesWon: 0,
  leaderboard: []
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setUsername: (state, {payload}) => {
      state.username = payload;
    },
    createDeck: (state) => {
      const cardsArray: any[] = Array.from({ length: 5 }, () => ({
        id: uuidv4(),
        type: generateRandomCardType()
      }));
      state.deck = cardsArray;
    },
    drawnCard: (state, {payload}) => {
      switch (payload.type) {
        // If the card drawn from the deck is a cat card, then the card is removed from the deck.
        case 'cat':
          if (state.deck.length === 1) {
            state.result = 'won'
            state.gamesWon += 1
          }
          state.deck = state.deck.filter(card => card.id !== payload.id);
          break;
        // If the card is defusing card, then the card is removed from the deck. This card can be used to defuse one bomb that may come in subsequent cards drawn from the deck.
        case 'defuse':
          if (state.deck.length === 1) {
            state.result = 'won'
            state.gamesWon += 1
          } else {
            state.defusingCardCount += 1;
          }
          state.deck = state.deck.filter(card => card.id !== payload.id);
          break;
        // If the card is a shuffle card, then the game is restarted and the deck is filled with 5 cards again.
        case 'shuffle':
          gameSlice.caseReducers.createDeck(state);
          state.defusingCardCount = initialState.defusingCardCount;
          break;
        //If the card is Exploding Kitten (bomb) then the player loses the game.
        case 'explode':
          if (state.defusingCardCount > 0) {
            state.defusingCardCount = state.defusingCardCount -= 1
            state.deck = state.deck.filter(card => card.id !== payload.id);
          } else {
            state.defusingCardCount = initialState.defusingCardCount;
            state.deck = initialState.deck;
            state.result = 'lost'
          }
          break;
        default:
          break;
      }
    },
    restart: (state) => {
      gameSlice.caseReducers.createDeck(state);
      state.defusingCardCount = initialState.defusingCardCount;
      state.result = ''
    },
    saveGame: (state) => {
      localStorage.setItem(state.username, JSON.stringify(state, null, 2));
    },
    fetchGame: (state) => {
      const storedData = localStorage.getItem(state.username);
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          if (Array.isArray(data.deck) && data.deck.length > 0) {
            state.deck = data.deck
            state.defusingCardCount = data.defusingCardCount
          } else {
            gameSlice.caseReducers.createDeck(state);
            state.defusingCardCount = initialState.defusingCardCount
          }          
          state.gamesWon = data.gamesWon ?? initialState.gamesWon;    
          state.result = ''
        } catch (error) {
          console.error('Error parsing stored data:', error);
        }
      }
    },
    fetchLeaderBoard: (state) => {
      try {
        const leaderboard = Object.keys(localStorage)
          .map((key: string) => ({
            username: key,
            score: JSON.parse(localStorage.getItem(key) ?? '').gamesWon
          }))
          .filter(({score}) => score > 0)
          state.leaderboard = leaderboard
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }
});

export const { setUsername, drawnCard, createDeck, restart, saveGame, fetchGame, fetchLeaderBoard } = gameSlice.actions;

export const getUsername = (state: any) => state.game.username;
export const getDeck = (state: any) => state.game.deck;
export const getResult = (state: any) => state.game.result;
export const getScore = (state: any) => state.game.gamesWon;
export const getLeaderBoard = (state: any) => state.game.leaderboard;
export const getLives = (state: any) => state.game.defusingCardCount;

export default gameSlice.reducer;
