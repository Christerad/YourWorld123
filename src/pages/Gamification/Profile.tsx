import { IonContent, IonPage, IonTitle, IonToolbar, IonRow, IonCol ,IonImg,IonText
    , IonItem, IonLabel, IonFab, IonFabButton, IonButton, IonBackButton, isPlatform,} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { personCircle,calendar, documentText, podium, trophy, add } from "ionicons/icons";
import React, { useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, onValue} from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import ProfilePicture from '../Controller/ProfilePicture'
import LevelController from '../Controller/LevelController'
import ExperienceController from '../Controller/ExperienceController';



const World: React.FC = () => {
    // console.log('Opening Profile')
    const [ProfilePhotoURL, SetProfilePhotoURL] = useState<string | any>()
    const [Username, SetUsername] = useState<string | any>()
    const [Level, SetLevel] = useState<Number | any>()
    const [XP, SetXP] = useState<Number| any>()
    
    const getUserPhotoURLname= async (photoURL2: string | null,username : string | null)=>{
        SetProfilePhotoURL(photoURL2);
        SetUsername(username);
    }

    const getUserData= async (uid: string)=>{
        const ref1 = ref(db, 'users/' + uid );
        onValue(ref1, (snapshot) => {
            const data = snapshot.val();
            // console.log('level :',data.Level);
            SetLevel(data.Level)
            // console.log('XP :',data.XP);
            SetXP(data.XP)

          });
    }

    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();
    // console.log('db :',db)



    const logout=()=>{
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
        history.push("/login")
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
        //   console.log('User :',user)
          const uid = user.uid;
          const UserPhotoURL=user.photoURL;
          const username=user.displayName
          getUserData(uid);
          getUserPhotoURLname(UserPhotoURL,username);
          
        } else {
            history.push('/login');
        }
      });
return(
<IonPage>
    {isPlatform('desktop') && (
        <IonToolbar>
            <IonRow class='ion-justify-content-center'>
                <IonText></IonText>
            </IonRow>
        </IonToolbar>
    )}
    <IonContent class='LoginandRegis'>
        <IonRow  >
            <IonCol class="ion-text-center" size='size-xs' >
                <IonBackButton defaultHref="/Schedule"/>
            </IonCol>
        </IonRow>
        <IonRow>
            <IonCol>
                <IonRow>
                    <IonText> {Username} </IonText>
                </IonRow>
                <IonRow>
                    <LevelController LvL={Level} />
                </IonRow>
                <ExperienceController LvL={Level} XP={XP} MaxXP={Level*10} />
            </IonCol> 
        </IonRow>
        <IonRow>
            <IonCol>
                <IonRow class='ion-justify-content-center'>
                    <IonImg class='TutoImage' src={ProfilePhotoURL} />
                </IonRow>
            </IonCol>
        </IonRow>
        <IonRow>
            {/* <IonItem> */}
                <IonButton onClick={()=>logout()}>Logout</IonButton>
            {/* </IonItem> */}
        </IonRow>
    </IonContent>
</IonPage>

);

};
export default World;