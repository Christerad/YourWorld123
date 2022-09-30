import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol
    , IonInput, IonItem, IonLabel, IonButton, IonAlert, IonImg, IonSlides, IonSlide, IonGrid, isPlatform, IonText } from '@ionic/react';

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { getAuth, createUserWithEmailAndPassword , updateProfile, onAuthStateChanged} from "firebase/auth";
import { useHistory } from 'react-router';
import { getDatabase, ref, set, push, child, update} from "firebase/database";


import Dune from '../../components/Image/Dune.png'
import MainIcon from '../../components/Image/Icon.png'


import TodolistGagal from '../../components/Image/TodolistGagal.png'

// import TodolistSukses from '../../components/Image/TodolistSuccess.png'

// import TodolistAdd from '../../components/Image/TodolistTutorial.png'


// import LeaderboardTuto from '../../components/Image/Tutorial-Leaderboard.png'

import LeaderboardTutoWorld from '../../components/Image/TutorialLeaderboard-World.png'

import WorldTuto from '../../components/Image/Tutorial-World.png'

import WorldTuto2 from '../../components/Image/Tutorial-World2.png'

import TutorialSummon from '../../components/Image/Tutorial-Summon.png'

import { getPlatforms } from '@ionic/core';



// import './Tutorial.css'

const Tutorial: React.FC = () => {
    console.log('Opening Tutorial')
    const history = useHistory();
    const db = getDatabase();
    const auth = getAuth();

    const [UID,SetUID] = useState<string | any>()

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('User :',user)
        const uid = user.uid;

        SetUID(uid);
        
      } else {
          // history.push('/login');
      }
        });
    const slideOpts = {
        initialSlide: 0,
        speed: 400
      };

    const btnend =async () =>{
      const postData ={
        FirstLogin:false
      }

      await update(ref(db,'/users/' + UID ), postData).then(() => {
        console.log('success')
        return true
      })
      .catch((error) => {
        console.log('Error code :',error.code)
        console.log('Error Message :',error.message)
        console.log('failed')
        return false
      });

        history.push('/Timer')
    }
    console.log(getPlatforms())
    if(isPlatform('desktop')){
      return(
        <IonContent class='LoginandRegis'>
                          <IonGrid style={{ height: "100%" }}>
                    <IonRow class="ion-align-items-center"  style={{ height: "100%" }}>
                        <IonCol>
                            <IonRow class="ion-justify-content-center">
                                <IonCol>
                                  <IonRow class='ion-justify-content-center'>
                                      <IonImg
                                          class='TutoImage'
                                          src={Dune}>
                                      </IonImg>
                                  </IonRow>
                                  <IonRow class='ion-justify-content-center'>
                                      <IonText>
                                        You are awake where earth is a wasteland 
                                      </IonText>
                                  </IonRow>
                              </IonCol>
                              <IonCol>
                                  <IonRow class="ion-justify-content-center">
                                      <IonImg
                                          class='TutoImage1'
                                          src={MainIcon}>
                                      </IonImg>
                                  </IonRow>
                                  <IonRow class='ion-justify-content-center'>
                                    <IonText>
                                        Its up to you to reshape the world using your time management skill
                                    </IonText>
                                  </IonRow>
                              </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonRow>
                                      <IonButton className="button1" onClick={()=>btnend()}>
                                          Close
                                      </IonButton>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </IonCol>       
                    </IonRow>


                </IonGrid>

        </IonContent>
    );
      
    }else {
      return(
        <IonContent class='LoginandRegis'>
          <IonSlides pager={true} options={slideOpts}>
            <IonSlide>
              <IonGrid>
                  <IonCol class="ion-align-self-center">
                    <IonRow class='ion-justify-content-center'>
                        <IonImg
                            class='Main-Icon-Mobile'
                            src={Dune}>
                        </IonImg>
                    </IonRow>
                    <IonRow class='ion-justify-content-center'>
                        You are awake where earth is a wasteland 
                    </IonRow>
                    <IonRow class="ion-justify-content-center">
                        <IonImg
                            class='Main-Icon-Mobile'
                            src={MainIcon}>
                        </IonImg>
                    </IonRow>
                    <IonRow class='ion-justify-content-center'>
                        Its up to you to reshape the world using your time management skill
                    </IonRow>
                    <IonRow class='ion-justify-content-center'>
                      <IonButton onClick={()=>btnend()}>
                          Close
                      </IonButton>
                    </IonRow>
                  </IonCol>
              </IonGrid>
            </IonSlide>
          </IonSlides>
      </IonContent>
        
      )

    }

  };
  
  export default Tutorial;