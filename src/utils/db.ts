import * as firebase from 'firebase';
import 'firebase/firestore';

import { Card } from 'utils/card';
import { Game } from 'utils/game';

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

export async function getGame( gameId: string )
{
  let gameRef = await db.collection( 'games' ).doc( gameId ).get();
  return gameRef.data() as Game | null;
}

export async function createGame( cards: Card[] )
{
  let batch = db.batch();

  let gameDoc = db.collection( 'games' ).doc();

  batch.set( gameDoc, { id: gameDoc.id } );

  let cardsRef = gameDoc.collection( 'cards' );

  for( let card of cards )
  {
    batch.set( cardsRef.doc(), card );
  }
  await batch.commit();

  let gameSnapshot = await gameDoc.get();
  return gameSnapshot.data() as Game;
}

export async function getCards( gameId: string )
{
  let cards = await db.collection( 'games' ).doc( gameId ).collection( 'cards' ).get();
  return cards.docs.map( snapshotToDataCreator<Game>() );
}

export function listenForCards( gameId: string, listener: ( card: Card[] ) => void )
{
  let cardsCollection = db.collection( 'games' ).doc( gameId ).collection( 'cards' );
  return cardsCollection.onSnapshot( ( cardsSnapshot ) =>
  {
    let cards = cardsSnapshot.docs.map( snapshotToDataCreator<Card>() );
    listener( cards );
  } );
}

export async function moveCard( gameId: string, cardId: string, x: number, y: number )
{
  let cardDoc = db.collection( 'games' ).doc( gameId ).collection( 'cards' ).doc( cardId );
  await cardDoc.update( {
    x,
    y
  } );
}
