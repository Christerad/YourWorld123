import { IonContent, IonPage, IonTitle, IonToolbar, IonRow, IonCol ,IonImg,IonText
    , IonItem, IonLabel, IonFab, IonFabButton, IonGrid, IonButton, IonModal, IonAlert, IonBackButton, IonButtons, IonHeader,} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import {thumbsUp } from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo, remove} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {arrowBack} from "ionicons/icons";

import LevelController from '../../Controller/LevelController'
import ExperienceController from '../../Controller/ExperienceController';

 import OtherWorldList from './OtherWorldList';

 import './OtherWorld.css'


const OtherWorld: React.FC<{OtherUID :string,CurrUID:string,CloseModal:Function}> = (props) => {
    // console.log('OtherUID :',props.OtherUID)
    // console.log('CurruID :',props.CurrUID)

    const [data, setData] = useState<any[]>([])
    //console.log('Opening World')
    // const [ProfilePhotoURL, SetProfilePhotoURL] = useState<string | any>()
    const [Username, SetUsername] = useState<string | any>()
    const [Level, SetLevel] = useState<Number | any>()
    const [XP, SetXP] = useState<Number| any>()
    const [showAlert1, setShowAlert1] = useState(false);
    const KeyChild=useRef<Number| any>()
    
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')
 
    const [LikeCount,SetLikeCount]=useState<Number| any>(0)
    const LikeCountRef=useRef<Number| any>(0)

        // LEON
        const history = useHistory();
        const auth = getAuth();
        const db = getDatabase();
        //console.log('db :',db)

    const getUserData= async (uid: string)=>{
        const ref1 = ref(db, 'users/' + uid );
        onValue(ref1, (snapshot) => {
            const data = snapshot.val();
            //console.log('level :',data.Level);
            SetLevel(data.Level)
            //console.log('XP :',data.XP);
            SetXP(data.XP)
            SetUsername(data.username)
            console.log('UserID Other World :',props.OtherUID)
          });
    }

    const removeID = (snapshot: any) => {
        snapshot.forEach((childSnapshot: any) => {  
            console.log('childsnapshot :',childSnapshot.key)    
            KeyChild.current=childSnapshot.key
        });
        const UpdateData={
            UID:null
        }
        update(ref(db,'World/' + props.OtherUID +'/LikesUID/'+KeyChild.current),UpdateData).then(() => {
            console.log('data removed')
        })

        const UpdateLikeCount={
            LikeCount:LikeCountRef.current-1 
        }
        update(ref(db,'World/' + props.OtherUID),UpdateLikeCount).then(() => {
            // Data saved successfully!
            console.log('World Liked')
        })  
        
    }
    const GetUserLikes =()=>{
        const mostViewedPosts =query(ref(db, 'World/'+props.OtherUID));
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

    const onclickLike =()=>{
        // console.log('OtherUID :',props.OtherUID)
        // console.log('CurruID :',props.CurrUID)

        const newPostKey = push(child(ref(db), 'World/'+props.OtherUID+'/LikesUID')).key;
        const mostViewedPosts =query(ref(db, 'World/'+props.OtherUID+'/LikesUID'),orderByChild("UID"),equalTo(props.CurrUID));
        onValue(mostViewedPosts, (snapshot) => {
            console.log('value :',snapshot.val())
            console.log('value key :',snapshot.key)


            if(snapshot.exists()){
                console.log('Already Liked')
                removeID(snapshot)
            }else{
                console.log('No been Liked Before')
                const UpdateLikesUID={
                    UID:props.CurrUID
                }
                update(ref(db,'World/' + props.OtherUID +'/LikesUID/'+newPostKey),UpdateLikesUID).then(() => {
                    // Data saved successfully!
                    console.log('World Liked')
                })     
                

                const UpdateLikeCount={
                    LikeCount:LikeCountRef.current+1 
                }
                update(ref(db,'World/' + props.OtherUID),UpdateLikeCount).then(() => {
                    // Data saved successfully!
                    console.log('World Liked')
                })                                                                                                   
            }

          }, {
            onlyOnce: true
          });
    }

    const GetOtherUserData =() =>{
        //console.log('User :',user)
        getUserData(props.OtherUID);
        GetUserLikes()
    };
    useEffect(() => {
        GetOtherUserData()
      }, [props.OtherUID])
        
return(
<IonPage>
    <IonContent class='LoginandRegis'>
        {/* <IonHeader>
            <IonToolbar>
                
                <IonCol>
                    <IonCol slot='start'>
                    <IonIcon src={arrowBack} size='large' />
                    </IonCol>
                    <IonCol>
                        <IonRow>
                            <IonText>{Username} </IonText>
                        </IonRow>
                        <IonRow>
                            <LevelController LvL={Level} />
                        </IonRow>
                        <ExperienceController LvL={Level} XP={XP} MaxXP={Level*3} />
                    </IonCol>
                </IonCol>

                
            </IonToolbar>
        </IonHeader> */}
        <IonGrid >
            <IonRow >
                <IonCol class="ion-text-center" size='size-xs' >
                    <IonIcon src={arrowBack} size='large' onClick={()=>props.CloseModal(false)} />
                </IonCol>
                <IonCol>
                    <IonRow>
                        <IonText>{Username} </IonText>
                    </IonRow>
                    <IonRow>
                        <LevelController LvL={Level} />
                    </IonRow>
                    <ExperienceController LvL={Level} XP={XP} MaxXP={Level*3} />
                </IonCol> 
            </IonRow>
            <IonRow>
                    <IonCol>
                        <IonItem class='ItemBackInvis'>
                            <IonButton onClick={()=>onclickLike()}>
                                <IonIcon src={thumbsUp}/>
                            </IonButton>
                            <IonText>
                               Likes :{LikeCount}
                            </IonText>
                        </IonItem>
                    </IonCol>
                </IonRow>
            <IonRow>
                <IonCol>
                    <OtherWorldList UID={props.OtherUID}  />
                </IonCol>
            </IonRow>
        </IonGrid>

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
export default OtherWorld;