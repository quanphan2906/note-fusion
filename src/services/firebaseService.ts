import {
	collection,
	doc,
	setDoc,
	getDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	FirestoreError,
	DocumentReference,
	DocumentData,
	UpdateData,
} from "firebase/firestore";
import {
	FirestoreCollection,
	FirestoreCollectionDataType,
} from "@/common/types/FirestoreCollection";
import { db } from "./firebaseConfig";
import { ServiceResult } from "@/common/types/ServiceResult";

type OptionalId<T> = Omit<T, "id"> | T;

export const createDocument = async <C extends FirestoreCollection>(
	collectionName: C,
	data: OptionalId<FirestoreCollectionDataType[C]>,
): Promise<ServiceResult<FirestoreCollectionDataType[C]>> => {
	try {
		const docRef = doc(collection(db, collectionName));
		await setDoc(docRef, data);
		return {
			status: "OK",
			message: `Document created with ID: ${docRef.id}`,
			data: {
				id: docRef.id,
				...data,
			},
		};
	} catch (error) {
		const err = error as FirestoreError;
		return { status: "ERROR", message: `Error adding document: ${err.message}` };
	}
};

export const getDocument = async <C extends FirestoreCollection>(
	collectionName: C,
	id: string,
): Promise<ServiceResult<FirestoreCollectionDataType[C]>> => {
	try {
		const docRef = doc(db, collectionName, id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return {
				status: "OK",
				data: docSnap.data() as FirestoreCollectionDataType[C],
				message: "Document retrieved successfully",
			};
		} else {
			return { status: "ERROR", message: "No such document!" };
		}
	} catch (error) {
		const err = error as FirestoreError;
		return { status: "ERROR", message: `Error getting document: ${err.message}` };
	}
};

export const getAllDocuments = async <C extends FirestoreCollection>(
	collectionName: C,
): Promise<ServiceResult<FirestoreCollectionDataType[C][]>> => {
	try {
		const querySnapshot = await getDocs(collection(db, collectionName));
		const documents: FirestoreCollectionDataType[C][] = [];
		querySnapshot.forEach((doc) => {
			documents.push({ id: doc.id, ...doc.data() } as FirestoreCollectionDataType[C]);
		});
		return {
			status: "OK",
			data: documents,
			message: "Documents retrieved successfully",
		};
	} catch (error) {
		const err = error as FirestoreError;
		return { status: "ERROR", message: `Error getting documents: ${err.message}` };
	}
};

export const updateDocument = async <C extends FirestoreCollection>(
	collectionName: C,
	id: string,
	updatedData: UpdateData<FirestoreCollectionDataType[C]>,
): Promise<ServiceResult<void>> => {
	try {
		const docRef = doc(db, collectionName, id) as DocumentReference<
			DocumentData,
			FirestoreCollectionDataType[C]
		>;
		await updateDoc(docRef, updatedData);
		return { status: "OK", message: `Document updated with ID: ${id}` };
	} catch (error) {
		const err = error as FirestoreError;
		return { status: "ERROR", message: `Error updating document: ${err.message}` };
	}
};

export const deleteDocument = async <C extends FirestoreCollection>(
	collectionName: C,
	id: string,
): Promise<ServiceResult<void>> => {
	try {
		const docRef = doc(db, collectionName, id);
		await deleteDoc(docRef);
		return { status: "OK", message: `Document deleted with ID: ${id}` };
	} catch (error) {
		const err = error as FirestoreError;
		return { status: "ERROR", message: `Error deleting document: ${err.message}` };
	}
};
