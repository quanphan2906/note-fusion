import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
	collection,
	doc,
	setDoc,
	getDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	DocumentReference,
	DocumentData,
	UpdateData,
} from "firebase/firestore";
import {
	FirestoreCollection,
	FirestoreCollectionDataType,
} from "@/common/types/Firestore";

// Firebase config
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type OptionalId<T> = Omit<T, "id"> | T;

export const createDocument = async <C extends FirestoreCollection>(
	collectionName: C,
	data: OptionalId<FirestoreCollectionDataType[C]>,
): Promise<FirestoreCollectionDataType[C]> => {
	const docRef = doc(collection(db, collectionName));
	await setDoc(docRef, data);

	return {
		id: docRef.id,
		...data,
	};
};

export const getDocument = async <C extends FirestoreCollection>(
	collectionName: C,
	id: string,
	throwIfNotFound: boolean = false,
): Promise<FirestoreCollectionDataType[C] | undefined> => {
	const docRef = doc(db, collectionName, id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) return docSnap.data() as FirestoreCollectionDataType[C];

	if (throwIfNotFound) {
		throw new Error(`Cannot find doc with id ${id} in collection ${collectionName}`);
	}

	return undefined;
};

export const getAllDocuments = async <C extends FirestoreCollection>(
	collectionName: C,
): Promise<FirestoreCollectionDataType[C][]> => {
	const querySnapshot = await getDocs(collection(db, collectionName));
	const documents: FirestoreCollectionDataType[C][] = [];
	querySnapshot.forEach((doc) => {
		documents.push({ id: doc.id, ...doc.data() } as FirestoreCollectionDataType[C]);
	});
	return documents;
};

export const updateDocument = async <C extends FirestoreCollection>(
	collectionName: C,
	id: string,
	updatedData: UpdateData<FirestoreCollectionDataType[C]>,
): Promise<void> => {
	const docRef = doc(db, collectionName, id) as DocumentReference<
		DocumentData,
		FirestoreCollectionDataType[C]
	>;
	await updateDoc(docRef, updatedData);
};

export const deleteDocument = async <C extends FirestoreCollection>(
	collectionName: C,
	id: string,
): Promise<void> => {
	const docRef = doc(db, collectionName, id);
	await deleteDoc(docRef);
};
