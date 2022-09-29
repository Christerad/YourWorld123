import { IonContent, IonPage, IonTitle, IonToolbar, IonRow, IonCol ,IonImg,IonText
    , IonItem, IonLabel, IonFab, IonFabButton, IonGrid, IonButton, IonModal, IonAlert, isPlatform,} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { personCircle,calendar, documentText, podium, trophy, add } from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, onValue, push, child, update, query} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import ProfilePicture from '../../Controller/ProfilePicture'
import LevelController from '../../Controller/LevelController'
import ExperienceController from '../../Controller/ExperienceController';

import WorldList from './WorldList';

import './World.css'

import FieldTicketImg from '../../../components/Image/FieldTicket.png'

const World: React.FC = () => {
    //console.log('Opening World')
    const [ProfilePhotoURL, SetProfilePhotoURL] = useState<string | any>()
    const [Username, SetUsername] = useState<string | any>()
    const [Level, SetLevel] = useState<Number | any>()
    const [XP, SetXP] = useState<Number| any>()
    const [UID,SetUID] = useState<string | any>()
    const [showAlert1, setShowAlert1] = useState(false);

    
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')
 
    const [FieldTicket,SetFieldTicket]=useState<Number| any>()
    const FieldTicketRef=useRef<Number| any>()

    const [showModalNewField, setShowModalNewField] = useState(false);
    const [LikeCount,SetLikeCount]=useState<Number| any>(0)
    const LikeCountRef=useRef<Number| any>(0)

    
    const OpenModal=()=>{
        setShowModalNewField(true)
    }
    
    const AddField=()=>{
            console.log('FieldTicket :',FieldTicket)
        
            if(FieldTicket==0){
                console.log('Field Ticket Not Enough')       
                SetErrorCode('Not Enough Ticket');
                SetErrorMessage('You didnt have Any Claim Field Ticket');
                setShowAlert1(true)
            }
            else{
                console.log('Field Ticket Enough')
                FieldTicketRef.current=FieldTicketRef.current-1
                console.log('FieldTicket Ref :',FieldTicketRef.current)
                const newPostKey = push(child(ref(db), 'Schedule/'+UID)).key;
                const WorldData = {
                    IsPlanted:false,
                    PlantID : ''    
                };
                const UserData ={
                    FieldTicket:FieldTicketRef.current
                }
                console.log('data :',WorldData)

                update(ref(db,'/World/' + UID + '/Fields/' + newPostKey), WorldData).then(() => {
                    // Data saved successfully!
                    console.log('World Created')
                })
                .catch((error) => {
                    // The write failed...
                    console.log('World Creat Failed')
                    console.log('Error code :',error.code)
                    console.log('Error Message :',error.message)
                    SetErrorCode(error.message);
                    SetErrorMessage(error.message);
                    setShowAlert1(true)
                });

                update(ref(db,'/users/' + UID), UserData).then(() => {
                    // Data saved successfully!
                    console.log('User Data Updated')
                })
                .catch((error) => {
                    // The write failed...
                    console.log('User Update Failed')
                    console.log('Error code :',error.code)
                    console.log('Error Message :',error.message)
                    SetErrorCode(error.message);
                    SetErrorMessage(error.message);
                    setShowAlert1(true)
                });
            }
    }

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
            SetFieldTicket(data.FieldTicket)
            FieldTicketRef.current=data.FieldTicket
          });
    }

    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();
    //console.log('db :',db)

    onAuthStateChanged(auth, (user) => {
        if (user) {
          //console.log('User :',user)
          const uid = user.uid;
          const UserPhotoURL=user.photoURL;
          const username=user.displayName;
          SetUID(uid);
          getUserData(uid);
          getUserPhotoURLname(UserPhotoURL,username);
          
        } else {
            history.push('/login');
        }
      });

      const GetUserLikes =()=>{
        const mostViewedPosts =query(ref(db, 'World/'+ UID));
        onValue(mostViewedPosts, (snapshot) => {

            console.log( 'val snapshost :',snapshot.val())
            console.log('Number Of Likes :',snapshot.val().LikeCount)
            console.log('exist or not :',snapshot.val())
            // snapshot.forEach((childSnapshot: any)=>{
            //     console.log(childSnapshot.key)
            // })
            if(snapshot.val().LikeCount!== undefined){
                console.log('count like done exist')
                LikeCountRef.current=snapshot.val().LikeCount
                SetLikeCount(snapshot.val().LikeCount)
            }else{
                console.log('count like didnt exist')
                LikeCountRef.current=0
                SetLikeCount(0)
            }

        })
    }
        
    useEffect(() => {
        GetUserLikes()
      }, [UID])
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
        <IonGrid >
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
                    <IonCol>
                        <IonItem class='ListInvisBack'>
                            <IonImg src={FieldTicketImg} class='ImgTicket' />
                            <IonText class='fontticketsize'>
                                Ticket : {FieldTicket}
                            </IonText>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem class='ListInvisBack'> 
                            <IonText class='fontticketsize'>
                               Likes : {LikeCount}
                            </IonText>
                        </IonItem>
                    </IonCol>
            </IonRow>
            <IonRow>
                you can add plants on empty field
            </IonRow>
            <IonRow>
                
                <IonCol>
                    <WorldList UID={UID}  />
                </IonCol>
            </IonRow>
        </IonGrid>

        <IonFab slot="fixed"  vertical="bottom" horizontal="end"  id="trigger-button-newField" onClick={async ()=>AddField()}>
            <IonFabButton id='Add-Todolist'>
                <IonIcon src={add}/>
            </IonFabButton>
        </IonFab>

        {/* <IonModal class='modal-wrapper2'  trigger="trigger-button-newField" isOpen={showModalNewField} showBackdrop={true} onDidDismiss={()=>setShowModalNewField(false)}>
            <IonContent>
                <IonRow class='ion-justify-content-center'>
                    <IonItem>
                        <IonCol>
                            <IonRow>
                            Claim Field Ticket  : {FieldTicket}
                            </IonRow>
                            <IonRow class='ion-justify-content-center'>
                                <IonImg src={FieldTicketImg} class='ImgTicket-2' />
                            </IonRow>
                        </IonCol>
                    </IonItem>

                </IonRow>
                <IonRow >
                    <IonCol >
                        <IonRow class='ion-justify-content-center'>
                            <IonButton onClick={async ()=>AddField()}> Claim Field</IonButton>
                        </IonRow>
                    </IonCol>
                    <IonCol >
                        <IonRow class='ion-justify-content-center'>
                            <IonButton onClick={() => setShowModalNewField(false)}> Cancel</IonButton>
                        </IonRow>
                    </IonCol>
                </IonRow>

            </IonContent>
        </IonModal> */}
        <IonAlert
                    isOpen={showAlert1}
                    onDidDismiss={() => setShowAlert1(false)}
                    cssClass='my-custom-class'
                    header={ErrorCode}
                    message={ErrorMessage}
                    buttons={['OK']}
                />
    </IonContent>
</IonPage>

);

};
export default World;