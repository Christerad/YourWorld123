import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol
    , IonInput, IonItem, IonLabel, IonButton, IonAlert, IonImg, IonSlides, IonSlide, IonGrid, isPlatform } from '@ionic/react';

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
          history.push('/login');
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
    // if(isPlatform('desktop')){
    //   return(
    //     <IonContent>
    //       <IonGrid>
    //       <IonRow class='ion-justify-content-center'>
    //         <IonCol class="ion-align-self-center">
    //           <IonRow class='ion-justify-content-center'>
    //               <IonImg
    //                   class='Main-Icon'
    //                   src={Dune}>
    //               </IonImg>
    //           </IonRow>
    //           <IonRow class='ion-justify-content-center'>
    //               You are awake where earth is a wasteland 
    //           </IonRow>
    //         </IonCol>

    //       </IonRow>
    //       <IonRow class='ion-justify-content-center'>
    //         <IonCol class="ion-align-self-center">
    //             <IonRow class="ion-justify-content-center">
    //                   <IonImg
    //                       class='Main-Icon'
    //                       src={MainIcon}>
    //                   </IonImg>
    //               </IonRow>
    //               <IonRow class='ion-justify-content-center'>
    //                   Its up to you to reshape the world using your time management skill
    //               </IonRow>
    //         </IonCol>
    //       </IonRow>
    //       <IonRow class='ion-justify-content-center'>
    //         <IonCol class="ion-align-self-center">
    //             <IonRow class='ion-justify-content-center'>
    //                   <IonImg
    //                       class='Main-Icon'
    //                       src={TutorialSummon}>
    //                   </IonImg>
    //               </IonRow>
    //               <IonRow class='ion-justify-content-center'>
    //                   You can add task in the todo-list Menu
    //               </IonRow>
    //         </IonCol>
    //         <IonCol class="ion-align-self-center">
    //             <IonGrid>
    //                 <IonRow class="ion-justify-content-center">
    //                     <IonCol>
    //                       <IonImg
    //                           class='Tutorial2ImageDesktop'
    //                           src={TodolistGagal}>
    //                       </IonImg>
    //                     </IonCol>
    //                     <IonCol>
    //                       <IonImg
    //                           class='Tutorial2ImageDesktop'
    //                           src={TutorialSummon}>
    //                       </IonImg>
    //                     </IonCol>
    //                 </IonRow>
    //               </IonGrid>

    //               <IonRow class='ion-justify-content-center'>
    //                   You can Swipe Right of left to decide you succeed or not.
    //               </IonRow>
    //         </IonCol>
    //       </IonRow>
    //       <IonRow class='ion-justify-content-center'>
    //         <IonCol class="ion-align-self-center">
    //               <IonRow class='ion-justify-content-center'>
    //                   <IonImg
    //                       class='Main-Icon'
    //                       src={TutorialSummon}>
    //                   </IonImg>
    //               </IonRow>
    //               <IonRow class='ion-justify-content-center'>
    //                   You can get Plants by summoning new plant  and you can exchange 5 summon ticket for 1 Field Ticket 
    //               </IonRow>
    //         </IonCol>
    //         <IonCol class="ion-align-self-center">
    //               <IonGrid>
    //                 <IonRow class="ion-justify-content-center">
    //                     <IonCol>
    //                       <IonImg
    //                           class='Tutorial2ImageDesktop'
    //                           src={TutorialSummon}>
    //                       </IonImg>
    //                     </IonCol>
    //                     <IonCol>
    //                       <IonImg
    //                           class='Tutorial2ImageDesktop'
    //                           src={LeaderboardTutoWorld}>
    //                       </IonImg>
    //                     </IonCol>
    //                 </IonRow>
    //               </IonGrid>

    //               <IonRow class='ion-justify-content-center'>
    //                  You can see your rank in the leaderboard and can see other people world by swiping right.
    //               </IonRow>
    //         </IonCol>
    //       </IonRow>

    //       <IonRow class='ion-justify-content-center'>
    //         <IonCol class="ion-align-self-center">
    //               <IonGrid>
    //                 <IonRow class="ion-justify-content-center">
    //                     <IonCol>
    //                       <IonImg
    //                           class='Tutorial2Image'
    //                           src={WorldTuto}>
    //                       </IonImg>
    //                     </IonCol>
    //                     <IonCol>
    //                       <IonImg
    //                           class='Tutorial2Image'
    //                           src={WorldTuto2}>
    //                       </IonImg>
    //                     </IonCol>
    //                 </IonRow>
    //               </IonGrid>
    //               <IonRow class='ion-justify-content-center'>
    //                  You can add A Field by pressing the + button and add plants you got to the field by clicking on the field.
    //               </IonRow>
    //         </IonCol>  
    //         <IonCol class="ion-align-self-center">
    //           <IonRow class='ion-justify-content-center'>
    //             <IonButton onClick={()=>btnend()}>
    //                 End Tutorial
    //             </IonButton>
    //           </IonRow>
    //         </IonCol>          
    //       </IonRow>

    //       </IonGrid>

    //     </IonContent>
    // );
    // }else {
      return(
        <IonContent>
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
                </IonCol>
            </IonGrid>
          </IonSlide>
          <IonSlide>
            <IonGrid>
                <IonCol class="ion-align-self-center">
                  <IonRow class='ion-justify-content-center'>
                      <IonImg
                          class='Main-Icon-Mobile'
                          src={TutorialSummon}>
                      </IonImg>
                  </IonRow>
                  <IonRow class='ion-justify-content-center'>
                      You can add task in the todo-list Menu
                  </IonRow>
                  <IonGrid>
                    <IonRow class="ion-justify-content-center">
                        <IonCol>
                          <IonImg
                              class='Tutorial2Image'
                              src={TodolistGagal}>
                          </IonImg>
                        </IonCol>
                        <IonCol>
                          <IonImg
                              class='Tutorial2Image'
                              src={TutorialSummon}>
                          </IonImg>
                        </IonCol>
                    </IonRow>
                  </IonGrid>

                  <IonRow class='ion-justify-content-center'>
                      You can Swipe Right of left to decide you succeed or not.
                  </IonRow>
                </IonCol>
              <IonRow/>
            </IonGrid>
          </IonSlide>
          <IonSlide>
            <IonGrid>
                <IonCol class="ion-align-self-center">
                  <IonRow class='ion-justify-content-center'>
                      <IonImg
                          class='Main-Icon-Mobile'
                          src={TutorialSummon}>
                      </IonImg>
                  </IonRow>
                  <IonRow class='ion-justify-content-center'>
                      You can get Plants by summoning new plant  and you can exchange 5 summon ticket for 1 Field Ticket 
                  </IonRow>
                  <IonGrid>
                    <IonRow class="ion-justify-content-center">
                        <IonCol>
                          <IonImg
                              class='Tutorial2Image'
                              src={TutorialSummon}>
                          </IonImg>
                        </IonCol>
                        <IonCol>
                          <IonImg
                              class='Tutorial2Image'
                              src={LeaderboardTutoWorld}>
                          </IonImg>
                        </IonCol>
                    </IonRow>
                  </IonGrid>

                  <IonRow class='ion-justify-content-center'>
                     You can see your rank in the leaderboard and can see other people world by swiping right.
                  </IonRow>
                </IonCol>
              <IonRow>

              </IonRow>
            </IonGrid>   
          </IonSlide>

          <IonSlide>
            <IonGrid>
                <IonCol class="ion-align-self-center">
                  <IonGrid>
                    <IonRow class="ion-justify-content-center">
                        <IonCol>
                          <IonImg
                              class='Tutorial2Image'
                              src={WorldTuto}>
                          </IonImg>
                        </IonCol>
                        <IonCol>
                          <IonImg
                              class='Tutorial2Image'
                              src={WorldTuto2}>
                          </IonImg>
                        </IonCol>
                    </IonRow>
                  </IonGrid>

                  <IonRow class='ion-justify-content-center'>
                     You can add A Field by pressing the + button and add plants you got to the field by clicking on the field.
                  </IonRow>
                  <IonRow class='ion-justify-content-center'>
                    <IonButton onClick={()=>btnend()}>
                        End Tutorial
                    </IonButton>
                  </IonRow>
                </IonCol>

            </IonGrid>  

            {/* <IonRow>
              <IonButton onClick={()=>history.push('/Schedule')}>
                  Go to Schedule
              </IonButton>
            </IonRow> */}

          </IonSlide>
        </IonSlides>
      </IonContent>
        
      )

    }

  // };
  
  export default Tutorial;