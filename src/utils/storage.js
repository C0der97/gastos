import { db } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';

export const saveImage = async (file) => {
    try {
        // 1. Compress the image
        const options = {
            maxSizeMB: 0.5, // Target smaller than 1MB for Firestore limit
            maxWidthOrHeight: 1280,
            useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // 2. Convert to Base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

        // 3. Save to Firestore 'receipts' collection
        const id = crypto.randomUUID();
        await setDoc(doc(db, 'receipts', id), {
            image: base64,
            createdAt: new Date().toISOString()
        });

        return id;
    } catch (error) {
        console.error('Error saving image:', error);
        return null;
    }
};

export const getImage = async (id) => {
    try {
        if (!id) return null;
        const docRef = doc(db, 'receipts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().image; // Returns the Base64 string
        } else {
            console.log("No such image document!");
            return null;
        }
    } catch (error) {
        console.error('Error getting image:', error);
        return null;
    }
};

export const deleteImage = async (id) => {
    try {
        if (!id) return;
        await deleteDoc(doc(db, 'receipts', id));
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};
