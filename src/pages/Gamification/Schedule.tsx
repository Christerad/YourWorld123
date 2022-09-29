import { IonContent, IonPage, IonToolbar, IonRow, IonCol
    , IonInput, IonItem, IonLabel, IonText, IonProgressBar} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { personCircle,calendar, documentText, podium, trophy, desktop } from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { doc, onSnapshot, collection, query, where, getDocs, DocumentData  } from "firebase/firestore";
import { useHistory,Redirect } from 'react-router';
import { getDatabase, ref, onValue} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import ProfilePicture from '../Controller/ProfilePicture'
import LevelController from '../Controller/LevelController'
import ExperienceController from '../Controller/ExperienceController';

import ScheduleList from './ScheduleList';
import { getPlatforms, isPlatform } from '@ionic/core';

const Schedule: React.FC = () => {
    console.log('Opening Schedule')
    
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
            SetLevel(data.Level)
            SetXP(data.XP)
          });
    }

    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            const UserPhotoURL=user.photoURL;
            const username=user.displayName
            SetUID(uid);
            getUserData(uid);
            getUserPhotoURLname(UserPhotoURL,username);
        } else {
                history.push('/login');
        }
    });

    // console.log(getPlatforms())
    // console.log('Is Desktop?',isPlatform('desktop'))
    return(
        <IonPage>
            {isPlatform('desktop') && (
                <IonToolbar>
                    <IonRow class='ion-justify-content-center'>
                        <IonText>Timer</IonText>
                    </IonRow>
                </IonToolbar>
            )}
            <IonContent >
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
                                <ExperienceController LvL={Level} XP={XP} MaxXP={Level*3} />
                        </IonCol> 
                    </IonRow>
                    <IonRow>
                        This Week Schedule
                    </IonRow>
    
                    <IonRow>
                        <IonCol>
                            
                        <ScheduleList UID={UID} />
                        </IonCol>   
                    </IonRow>
                    <IonRow>
          
                    <h6>*Swipe Right of left to decide success or not </h6>
                    </IonRow>
            </IonContent>
        </IonPage>


    );

};
export default Schedule;