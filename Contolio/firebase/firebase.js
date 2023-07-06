const admin = require('firebase-admin');


let serviceAccount  ={
    "type": "service_account",
    "project_id": "contolio-24fa9",
    "private_key_id": "04aa5a97811c398504002fd337d7974288fb2727",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVQLpdk2R4l/jV\n5yJ/1gVnDpwiA+drg8nMbggZz6OZAasmduN7N/GbehEP4hJthikr9Y1ctjlTUoJH\nE8ePsEkwN7HVao/k4HQw7NmBRa54Uksl1E5zPWH1SVDadE44K5odmhbyDMX0AWr2\nxsV2TNC4hDGkCR1vsnBkxUUl8yoIamaVhYwrIEnEKVKxaSiihFYiCIxu9sQXwKWs\ngl/qigKs8Vk94KhjV4Chf5zeTRy9a25yD/vnI7/YUlifY3pgXIHQ4KnOeAttQn0m\nUudzCeo8C5JhxsuczPzQyDFFWVNHSGxSMq14LA94rBs2A/phZ5TWDWFNFMWx8ZwJ\nAAmm5+3JAgMBAAECggEALV5lt8pHhgN4+FMB6zYGdLguPetcNOq3CEPBe/JJoR/y\ngE6rU1fh0jzMO/eSCZSRFk3ZqweGlyQ23LXHz1lHHNfAgQG4hs480frVxFOljGof\nnDb4kLpWqJdWOP+k83zNPy584raWd7TEg6dis6ogfpz7LaWVymFpWXsBnNMIlnze\n1lC5bPZarf9ZTd/882HD1OU93hMKZ7wlQWTzdUc2enNdo7HqM4adtu5vNatRcgo5\nwx70KSEx0OSm2xpTFzT4OpVvcOjPCeQtLQwQoQQHO8qGKUyf7iQCvbDA7DH+ewnb\n37sLStYkw8X000egkzlvrnECj7pVTatD5arJ/bFTPQKBgQD63xG8W+So0Nrow/+z\nwx+zHczvQFP0vsM9YQG2keg/cf7/EL3BmwuoxivtJgt1Zn5b1rNVBi80YdcVaVjD\nBHRRFi4tdTZ2uiCOGipn2vARE3dQMwVH8wQOT+/pkVqI8l8J/5K/ZP1V6V8N23wk\nSqTG3JVa7iadCJxubHQQvawkVQKBgQDZnMhp9ELyjZidB9K7Op+7TzxBok+I8VLp\n72kD+I0hKmpoQgepGuCWubzYZEAuxXpVyYo6NXV5rJdi/4Z8xz9o72+CeruFPHxY\nf6XUoEhL6FpZdUwkrrrIQQqKawIPWEBt/BwzNJ02swW/BtfM2yzlHto9x4LAj27+\nAyvIIs13pQKBgQCz4d9FwF5k7d0JqgBfVToVpPidVPLeOyqjiDtCPbzaQVMmcUqe\n2B20FuTIVs9Ajw1rrLdJ7/VJCh6/K5qJu1fsDItv7OvwleVh/0EI1uPsWpji2LKg\ntI/j802DnMXeDGw5Lxh6RF+iioOt3ANXwm4EaYZufPUTBGmmg/11Q4t7QQKBgArZ\nEPiPL6MtwdTaJfwlYP8SZRuUfsiB1zNINwD2q/piRemqmP0qFNYOrkZPQQ/T0lRi\ndpyOO6v0GZvaxxaDTDrr7LAhdCWhLUWwH1EpKFF4ZMCe40vU1gTTkTXzPagMKzIQ\nZkt7LPckF349VhalOmi1kAWSY4c73zmUaONSMNHtAoGBAPKO5GImv2NeKXAySpUQ\nboPm+KjwCWvGRyfjjadLx0sH6tHXvw9QPprTgYbqw1CAQ5xDk53oIeSD3CIs40aR\nNq0+7fanJPU1l1Ru3S1A8YGODP5Gf0T7DVoKDtPif/l/1tDfMUSqiLdfdzdlH5EI\nQt4vjLfycoTU78GxiW+lz1Au\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-8pnkg@contolio-24fa9.iam.gserviceaccount.com",
    "client_id": "111212341001536911148",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8pnkg%40contolio-24fa9.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  
  const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
 const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
  initializeApp({
    credential: cert(serviceAccount)
  });
  const db = getFirestore();
 
  const addUser=async function addUserToFirebase(){
    // console.log("&&&&&");
    let refData ={
       email :"heloo@gmail.com",
       password :"123@abc"
    }
    let add = await db.collection('Contolio_Users').add(refData);
    console.log(add.id);
  }

//  addUser()
 module.exports = addUser;
