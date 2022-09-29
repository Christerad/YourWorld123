import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol ,IonImg, IonText
    , IonInput, IonItem, IonLabel, IonTabs ,IonTabBar, IonTabButton, IonRouterOutlet, isPlatform} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { personCircle,calendar, documentText, podium, trophy } from "ionicons/icons";
import React, { useState, useRef } from 'react';
import { format, parseISO } from 'date-fns';

import { useHistory } from 'react-router';

import { getDatabase, ref, onValue} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import ProfilePicture from '../Controller/ProfilePicture'
import LevelController from '../Controller/LevelController'
import ExperienceController from '../Controller/ExperienceController';

//import AchievementsList from './AchievementsList2';
import TodoList2 from './TodoList';
import AchievementsList2 from './AchievementsList2';

const Achievements2: React.FC = () => {
    console.log('Opening Achievements')

    const [ProfilePhotoURL, SetProfilePhotoURL] = useState<string | any>()
    const [Username, SetUsername] = useState<string | any>()
    const [Level, SetLevel] = useState<Number | any>()
    const [XP, SetXP] = useState<Number| any>()
    const [UID,SetUID] = useState<string | any>()

    const getUserPhotoURLname= async (photoURL2: string | null,username : string | null)=>{
        SetProfilePhotoURL(photoURL2);
        SetUsername(username);
    }

    const getUserData= async (uid: string)=>{
        const ref1 = ref(db, 'users/' + uid );
        onValue(ref1, (snapshot) => {
            const data = snapshot.val();
            //console.log('level :',data.Level);
            SetLevel(data.Level)
            //console.log('XP :',data.XP);
            SetXP(data.XP)

          });
    }

    // LEON
    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();
    //console.log('db :',db)



        onAuthStateChanged(auth, (user) => {
            if (user) {
              //console.log('User :',user)
              const uid = user.uid;
              //console.log('UID :',UID)
              const UserPhotoURL=user.photoURL;
              const username=user.displayName
              SetUID(uid);
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
                <IonText>Schedule</IonText>
            </IonRow>
        </IonToolbar>
        )}
    <IonContent class='LoginandRegis'>
        <IonRow  >
            <IonCol class="ion-text-center" size='size-xs'>
                <ProfilePicture PhotoUrl={ProfilePhotoURL} />
            </IonCol>
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
            <AchievementsList2 UID={UID} />
            {/* <TodoList2 UID={UID} /> */}
        </IonRow>
    </IonContent>
</IonPage>

);

};
export default Achievements2;