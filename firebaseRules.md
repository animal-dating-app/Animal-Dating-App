Add the following rules to the Firebase console to secure the database. This will prevent unauthorized access to the database and ensure that only the correct users can read, write, update, and delete documents.

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
    }
    
    match /users/{id} {
      allow read: if true;
      
      // Allow creating a new document
      allow create, update: if request.auth != null && request.auth.uid == request.resource.data.userId;
		}	
    
    match /shelters/{id} {
      allow read: if true;
      
      // Allow creating a new document
      allow create, update: if request.auth != null && request.auth.uid == request.resource.data.shelterId;
		}	
  }
}
```