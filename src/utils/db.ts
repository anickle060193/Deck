import * as firebase from 'firebase';
import 'firebase/firestore';

import { Card, CardBase, CardUpdate, cardSorter } from 'utils/card';
import { Game, GameUpdate } from 'utils/game';

firebase.initializeApp( {
  apiKey: 'AIzaSyCHBeQAOAPQsykJArFxIcp1z_Lt0bKwlWk',
  authDomain: 'deck-2165b.firebaseapp.com',
  // databaseURL: 'https://deck-2165b.firebaseio.com',
  projectId: 'deck-2165b',
  // storageBucket: 'deck-2165b.appspot.com',
  // messagingSenderId: '812325035834'
} );

const db = firebase.firestore();

function snapshotToDataCreator<T>()
{
  return ( snapshot: firebase.firestore.DocumentSnapshot ) =>
  {
    let data = snapshot.data();
    data.id = snapshot.id;
    return data as T;
  };
}

const snapshotToCard = snapshotToDataCreator<Card>();
const snapshotToGame = snapshotToDataCreator<Game>();

export async function getGame( gameId: string )
{
  let gameRef = await db.collection( 'games' ).doc( gameId ).get();
  return gameRef.data() as Game | null;
}

export async function createGame( cards: CardBase[] )
{
  let batch = db.batch();

  let gameDoc = db.collection( 'games' ).doc();

  let game: Game = {
    id: gameDoc.id,
    nextCardIndex: Math.max( ...cards.map( ( card ) => card.index ) ) + 1
  };

  batch.set( gameDoc, game );

  let cardsRef = gameDoc.collection( 'cards' );

  for( let card of cards )
  {
    batch.set( cardsRef.doc(), card );
  }
  await batch.commit();

  let gameSnapshot = await gameDoc.get();
  return gameSnapshot.data() as Game;
}

export async function saveCards( gameId: string, cards: CardUpdate[] )
{
  let cardsCollection = db.collection( 'games' ).doc( gameId ).collection( 'cards' );
  let batch = db.batch();

  for( let { id, ...card } of cards )
  {
    batch.update( cardsCollection.doc( id ), card );
  }

  await batch.commit();
}

export function listenForCards( gameId: string, listener: ( card: Card[] ) => void )
{
  let cardsCollection = db.collection( 'games' ).doc( gameId ).collection( 'cards' );
  return cardsCollection.onSnapshot( ( cardsSnapshot ) =>
  {
    let cards = cardsSnapshot.docs.map( snapshotToCard );
    listener( cards );
  } );
}

export async function touchCard( gameId: string, cardId: string )
{
  await db.runTransaction( async ( transaction ) =>
  {
    let gameDoc = db.collection( 'games' ).doc( gameId );
    let gameSnapshot = await transaction.get( gameDoc );
    let game = snapshotToGame( gameSnapshot );

    let cardDoc = gameDoc.collection( 'cards' ).doc( cardId );
    let cardUpdate: Omit<CardUpdate, 'id'> = { index: game.nextCardIndex };
    transaction.update( cardDoc, cardUpdate );

    let gameUpdate: Omit<GameUpdate, 'id'> = { nextCardIndex: game.nextCardIndex + 1 };
    transaction.update( gameDoc, gameUpdate );
  } );
}

export async function flipCards( gameId: string, cardIds: string[], faceDown: boolean )
{
  let cards = cardIds.map( ( id ) => ( {
    id,
    faceDown
  } ) );
  await saveCards( gameId, cards );
}

export async function moveCards( gameId: string, cardIds: string[], xOffset: number, yOffset: number )
{
  await db.runTransaction( async ( transaction ) =>
  {
    let gameDoc = db.collection( 'games' ).doc( gameId );
    let gameSnapshot = await transaction.get( gameDoc );
    let game = snapshotToGame( gameSnapshot );

    let cardsCollection = gameDoc.collection( 'cards' );
    let cardDocs = cardIds.map( ( id ) => cardsCollection.doc( id ) );
    let cardSnapshots = await Promise.all( cardDocs.map( ( cardDoc ) => cardDoc.get() ) );
    let cards = cardSnapshots.map( snapshotToCard ).sort( cardSorter ).reverse();

    let nextCardIndex = game.nextCardIndex;
    for( let card of cards )
    {
      let cardUpdate: Omit<CardUpdate, 'id'> = {
        index: nextCardIndex++,
        x: card.x + xOffset,
        y: card.y + yOffset
      };
      transaction.update( cardsCollection.doc( card.id ), cardUpdate );
    }

    let gameUpdate: Omit<GameUpdate, 'id'> = {
      nextCardIndex: nextCardIndex
    };
    transaction.update( gameDoc, gameUpdate );
  } );
}
