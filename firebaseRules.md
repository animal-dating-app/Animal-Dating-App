Add the following rules to the Firestore section of the Firebase console to secure the database. This will prevent unauthorized access to the database and ensure that only the correct users can read, write, update, and delete documents.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    
    match /animals/{id} {
      allow read: if true;
      
      // Allow creating a new document
      allow create: if request.auth != null && request.auth.uid == request.resource.data.shelterId;

      // Allow updating or deleting an existing document
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.shelterId;
      
      // Allow delete if Admin
      allow update, delete: if request.auth != null && request.auth.uid == "L89J59dWmKYqWupE2ngVY2NIhNq1";
    }
    
    match /users/{id} {
      allow read: if true;
      
      // Allow creating a new document
      allow create, update: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Allow delete if Admin
      allow update, delete: if request.auth != null && request.auth.uid == "L89J59dWmKYqWupE2ngVY2NIhNq1";
		}	
    
    match /shelters/{id} {
      allow read: if true;
      
      // Allow creating a new document
      allow create, update: if request.auth != null && request.auth.uid == request.resource.data.shelterId;
      
      // Allow delete if Admin
      allow update, delete: if request.auth != null && request.auth.uid == "L89J59dWmKYqWupE2ngVY2NIhNq1";
		}	
    
    // Rules for the messages collection
    match /messages/{messageId} {
      // Read message if the user is sender or receiver
      allow read: if request.auth != null && (resource.data.fromId == request.auth.uid || resource.data.toId == request.auth.uid);

      // Write message if the user is the sender
      allow create: if request.auth != null && request.auth.uid == request.resource.data.fromId;

      // Allow recipient to mark message as read
      allow update: if request.auth != null && request.auth.uid == resource.data.toId && request.resource.data.read == true;

      // No updates or deletes allowed (can modify this based on your app's requirements)
      allow delete: if false;
    }
  }
}
```

Add the following rules to the Storage section of the Firebase console to secure the storage. This will prevent unauthorized access to the storage and ensure that only the correct users can upload and download files.

```js
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
  
  match /images/{imageId} {
      allow read, write: if request.auth != null;
    }
}
```