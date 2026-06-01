import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJPt77J2ryXw_nKpc3y9w_SetOXS8lzQ8",
  authDomain: "sweetbox-3332d.firebaseapp.com",
  projectId: "sweetbox-3332d",
  storageBucket: "sweetbox-3332d.firebasestorage.app",
  messagingSenderId: "438404701255",
  appId: "1:438404701255:web:27e6bbc20e777f7f2ce562"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;