import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config'
import { onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut  } from "firebase/auth";
import { getDatabase, ref, onValue, set, child, get, remove, update, push} from "firebase/database";

const app = initializeApp(firebaseConfig)

const auth = getAuth();
const db = getDatabase(app);
const APP_DATA_PATHS = [
  'admins',
  'users',
  'bank',
  'register',
  'login',
  'counter',
  'CotizacionAerea',
  'CotizacionMaritima',
  'CotizacionTerrestre',
  'NotaDeCobranza',
  'NoDeManifiesto',
  'invoice',
  'invoices',
  'invoicePaymentInstructions',
  'ca-incluye',
  'ca-excluye',
  'ca-notas',
  'cm-incluye',
  'cm-excluye',
  'cm-notas',
  'ct-incluye',
  'ct-excluye',
  'ct-notas',
]

function onAuth(setUserProfile, setUserData) {
  let unsubscribeData = null;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (unsubscribeData) {
      unsubscribeData();
      unsubscribeData = null;
    }

    if (user) {
      setUserProfile(user)
      unsubscribeData = getData(setUserData)
    } else {
      setUserProfile(user)
      unsubscribeData = getData(setUserData)

    }
  });

  return () => {
    if (unsubscribeData) {
      unsubscribeData();
    }
    unsubscribeAuth();
  };
}

// ---------------------------Login, Sign Up and Sign In------------------------------------

function signUpWithEmail (email, password) {
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}
function signInWithEmail (email, password, setUserSuccess) {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setUserSuccess(false)
  });
}

function handleSignOut () {
  signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
}

// -------------------------------Firebase Realtime Database------------------------------------

const dbRef = ref(getDatabase());

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function normalizeFirebaseValue(value, seen = new WeakSet()) {
  if (value === null) {
    return null;
  }

  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeFirebaseValue(item, seen));
  }

  if (!isPlainObject(value)) {
    return JSON.parse(JSON.stringify(value));
  }

  if (seen.has(value)) {
    throw new Error('firebase-normalize-circular-reference');
  }

  seen.add(value);

  const normalized = Object.entries(value).reduce((acc, [key, entryValue]) => {
    if (entryValue === undefined || typeof entryValue === 'function' || typeof entryValue === 'symbol') {
      return acc;
    }

    acc[key] = normalizeFirebaseValue(entryValue, seen);
    return acc;
  }, {});

  seen.delete(value);

  return normalized;
}

function shouldUseRestFallback(error) {
  const message = error && error.message ? error.message : '';
  const code = error && error.code ? error.code : '';

  return (
    message.includes('Maximum call stack size exceeded') ||
    code === 'firebase/unknown'
  );
}

async function writeDataByRest(method, rute, object) {
  const normalizedRoute = rute.replace(/^\/+/, '');
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : '';
  const authQuery = token ? `?auth=${encodeURIComponent(token)}` : '';
  const response = await fetch(`${firebaseConfig.databaseURL}/${normalizedRoute}.json${authQuery}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(object),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`firebase-rest-${method.toLowerCase()}-${response.status}:${responseText}`);
  }

  return response.json();
}

async function readDataByRest(rute) {
  const normalizedRoute = rute.replace(/^\/+/, '');
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : '';
  const authQuery = token ? `?auth=${encodeURIComponent(token)}` : '';
  const response = await fetch(`${firebaseConfig.databaseURL}/${normalizedRoute}.json${authQuery}`);

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`firebase-rest-get-${response.status}:${responseText}`);
  }

  return response.json();
}

function writeUserDataByRest(rute, object, setUserSuccess) {
  const normalizedObject = normalizeFirebaseValue(object)

  return writeDataByRest('PATCH', rute, normalizedObject)
  .then(() => setUserSuccess !== null ? setUserSuccess('save') : '')
  .catch((error) => {
    console.error(`firebase-rest-patch-error:${rute}`, error)
    setUserSuccess !== null ? setUserSuccess('repeat') : ''
    throw error
  })
}

function replaceUserDataByRest(rute, object, setUserSuccess) {
  const normalizedObject = normalizeFirebaseValue(object)

  return writeDataByRest('PUT', rute, normalizedObject)
  .then(() => setUserSuccess !== null ? setUserSuccess('save') : '')
  .catch((error) => {
    console.error(`firebase-rest-put-error:${rute}`, error)
    setUserSuccess !== null ? setUserSuccess('repeat') : ''
    throw error
  })
}

function readUserDataByRest(rute) {
  return readDataByRest(rute)
  .catch((error) => {
    console.error(`firebase-rest-get-error:${rute}`, error)
    throw error
  })
}

async function readPathValue(path) {
  try {
    const snapshot = await get(ref(db, `/${path}`));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (sdkError) {
    try {
      const response = await fetch(`${firebaseConfig.databaseURL}/${path}.json`);

      if (!response.ok) {
        throw new Error(`firebase-rest-${path}-${response.status}`);
      }

      return await response.json();
    } catch (restError) {
      console.error(`firebase-read-error:${path}`, sdkError, restError);
      throw restError;
    }
  }
}

function getData(setUserData) {
  let isSubscribed = true;

  const updateNode = (key, value) => {
    setUserData((prev) => {
      const base = prev && typeof prev === 'object' ? prev : {};
      return {
        ...base,
        [key]: value,
      };
    });
  };

  Promise.allSettled(
    APP_DATA_PATHS.map(async (path) => {
      const value = await readPathValue(path);
      return { path, value };
    })
  ).then((results) => {
    if (!isSubscribed) {
      return;
    }

    results.forEach((result, index) => {
      const path = APP_DATA_PATHS[index];

      if (result.status === 'fulfilled') {
        updateNode(result.value.path, result.value.value);
        return;
      }

      console.error(`firebase-bootstrap-error:${path}`, result.reason);
      updateNode(path, null);
    });
  });

  const subscriptions = APP_DATA_PATHS.map((path) =>
    onValue(
      ref(db, `/${path}`),
      (snapshot) => {
        updateNode(path, snapshot.exists() ? snapshot.val() : null);
      },
      (error) => {
        console.error(`firebase-subscribe-error:${path}`, error);
      }
    )
  );

  return () => {
    isSubscribed = false;
    subscriptions.forEach((unsubscribe) => unsubscribe());
  };
}

function getSpecificData(query, setUserSpecificData) {

  get(child(dbRef, `users/${query}`)).then((snapshot) => {
    if (snapshot.exists()) {
      setUserSpecificData(snapshot.val()) 
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function writeUserData (rute, object, setUserSuccess) {
  const normalizedObject = normalizeFirebaseValue(object)

  return update(ref(db, rute), normalizedObject )
  .then(()=> setUserSuccess !== null? setUserSuccess('save'): '')
  .catch(async (error)=>{
    console.error(`firebase-update-error:${rute}`, error)

    if (shouldUseRestFallback(error)) {
      console.warn(`firebase-update-rest-fallback:${rute}`, error)
      await writeDataByRest('PATCH', rute, normalizedObject)
      setUserSuccess !== null ? setUserSuccess('save') : ''
      return
    }

    setUserSuccess !== null ? setUserSuccess('repeat') : ''
    throw error
  })
}

function replaceUserData (rute, object, setUserSuccess) {
  const normalizedObject = normalizeFirebaseValue(object)

  return set(ref(db, rute), normalizedObject)
  .then(()=> setUserSuccess !== null ? setUserSuccess('save') : '')
  .catch(async (error)=> {
    console.error(`firebase-set-error:${rute}`, error)

    if (shouldUseRestFallback(error)) {
      console.warn(`firebase-set-rest-fallback:${rute}`, error)
      await writeDataByRest('PUT', rute, normalizedObject)
      setUserSuccess !== null ? setUserSuccess('save') : ''
      return
    }

    setUserSuccess !== null ? setUserSuccess('repeat') : ''
    throw error
  })
}

function pushUserData (rute, object, setUserSuccess) {
  const newRef = push(ref(db, rute))

  return set(newRef, object)
  .then(()=> {
    setUserSuccess !== null ? setUserSuccess('save') : ''
    return newRef.key
  })
  .catch((error)=> {
    console.error(`firebase-push-error:${rute}`, error)
    setUserSuccess !== null ? setUserSuccess('repeat') : ''
    throw error
  })
}

async function removeData (rute, setUserData, setUserSuccess) {
  await remove(ref(db, rute)).then(()=>setUserSuccess('save')).catch(()=>setUserSuccess('repeat'));
}


function subscribeToPath(path, callback) {
  return onValue(ref(db, path), (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
}

export { onAuth, signUpWithEmail, signInWithEmail, handleSignOut, getData, getSpecificData, writeUserData, replaceUserData, writeUserDataByRest, replaceUserDataByRest, readUserDataByRest, pushUserData, removeData, subscribeToPath }
