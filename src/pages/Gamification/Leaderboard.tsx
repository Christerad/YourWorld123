import { IonContent, IonHeader, IonPage, IonRow, IonCol, IonImg, IonText
    ,IonItem,
    isPlatform,
    IonToolbar,
    IonGrid,} from '@ionic/react';
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
import LeaderbordList from '../Gamification/LeaderbordList';

const Leaderboard: React.FC = () => {
    // console.log('Opening Leaderboard')
    

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
          const uid = user.uid;
          const UserPhotoURL=user.photoURL;
          const username=user.displayName
          getUserData(uid);
          SetUID(uid);
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
        <IonGrid>
            <IonRow>
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
                    <ExperienceController LvL={Level} XP={XP} MaxXP={Level*3} />
                </IonCol> 
            </IonRow>
            <IonRow>
                <h6>*Swipe Right to see other players world </h6>
            </IonRow>
            <IonRow>
                <IonCol>
                    <LeaderbordList UID={UID}/>
                </IonCol>
            </IonRow>
        </IonGrid>
    </IonContent>
</IonPage>

);

};
export default Leaderboard;