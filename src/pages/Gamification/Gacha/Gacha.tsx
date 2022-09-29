import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol ,IonImg, IonText
    , IonInput, IonItem, IonLabel, IonLoading ,IonTabBar, IonTabButton, IonRouterOutlet, IonList, IonListHeader, IonAlert, IonGrid, IonButton, IonModal, isPlatform} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { personCircle,calendar, documentText, podium, trophy, star } from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';


import { useHistory } from 'react-router';

import { getAuth, onAuthStateChanged } from "firebase/auth";


import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo} from "firebase/database";
import ExperienceController from '../../Controller/ExperienceController'
import LevelController from '../../Controller/LevelController';
import ProfilePicture from '../../Controller/ProfilePicture';

import InventoryList from './InventoryList'

import SummonTicketImg from '../../../components/Image/PlantTicket.png'
import FieldTicketImg from '../../../components/Image/FieldTicket.png'
import AltarImg from '../../../components/Image/Altar.png'
import  './Gacha.css'

const Gatcha: React.FC= () => {

    const [ProfilePhotoURL, SetProfilePhotoURL] = useState<string | any>()
    const [Username, SetUsername] = useState<string | any>()
    const [Level, SetLevel] = useState<Number | any>()
    const [XP, SetXP] = useState<Number| any>()
    const [UID,SetUID] = useState<string | any>()
    const [showAlert1, setShowAlert1] = useState(false);
    const [data, setData] = useState<any[]>([])

    const [IsEmpty,setIsEmpty]=useState(true)
    const [showModalGacha, setShowModalGacha] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')
 
    const [SummonTicket,SetSummonTicket]=useState<Number| any>()
    const SummonTicketRef=useRef<Number| any>()

    const SummonCount=useRef<Number| any>()

    const levelRange=useRef<Number| any>()

    
    const [FieldTicket,SetFieldTicket]=useState<Number| any>()
    const FieldTicketRef=useRef<Number| any>()


    const [PlantID,SetPlantID]=useState<Number>()
    const [PLantName,SetPlantName]=useState<String>()
    const [PLantImg,SetPlantImg]=useState<String| any>()
    const [Rarity,setRarity]=useState<Number>()

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
            if(Level<=10){
                levelRange.current=10
            }else if(Level<=20){
                levelRange.current=20
            }
            else if(Level<=30){
                levelRange.current=30
            }
            else if(Level<=40){
                levelRange.current=40
            }
            else if(Level<=50){
                levelRange.current=50
            }
            else if(Level<=60){
                levelRange.current=60
            }
            //console.log('XP :',data.XP);
            SetXP(data.XP)
            SetSummonTicket(data.SummonTicket)
            SummonTicketRef.current=data.SummonTicket
            SetFieldTicket(data.FieldTicket)
            FieldTicketRef.current=data.FieldTicket
            SummonCount.current=data.SummonPulled
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

    const ClaimFieldTicket=()=>{
        if(SummonTicket<5){
            console.log('Summon Ticket Not Enough')       
            SetErrorCode('Not Enough Ticket');
            SetErrorMessage('You Need 5 Summon ticket for 1 Field Ticket');
            setShowAlert1(true)
        }else{
            console.log('Summon Ticket Enough')
            SummonTicketRef.current=SummonTicketRef.current-5
            console.log('SummonTicket Ref :',SummonTicketRef.current)
            FieldTicketRef.current=FieldTicketRef.current+1
            console.log('FieldlTicket Ref :',FieldTicketRef.current)

            const UserData ={
                SummonTicket: SummonTicketRef.current,
                FieldTicket: FieldTicketRef.current
            }

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

    const SummonPlant=()=>{

        
        if(SummonTicket==0){
            console.log('Summon Ticket Not Enough')       
            SetErrorCode('Not Enough Ticket');
            SetErrorMessage('You didnt have Any Summon Ticket');
            setShowAlert1(true)
        }else{
            
            console.log('Summon Ticket Enough')
            SummonTicketRef.current=SummonTicketRef.current-1
            // console.log('SummonTicket Ref :',SummonTicketRef.current)
            SummonCount.current=SummonCount.current+1

 
            const UserData ={
                SummonTicket:SummonTicketRef.current,
                SummonPulled:SummonCount.current
            }

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

            

            const PlantsQuery =query(ref(db, 'Probs/'+ levelRange.current));
            onValue(PlantsQuery, (snapshot) => {
                function getRandom () {
                    var num = Math.random(),
                        s = 0,
                        lastIndex = weights.length - 1;
                        //console.log('Probabilty randomed :',num)
                
                    for (var i = 0; i < lastIndex; ++i) {
                        s += weights[i];
                        if (num < s) {
                            return results[i];
                        }
                    }
                
                    return results[lastIndex];
                };

                console.log('snapshot key :',snapshot.key)

                let weights: any[] =[] ; // probabilities
                let results: any[] =[] // values to return

                console.log('kelipatan 10? :',SummonCount.current % 10)
                if(SummonCount.current % 10 ==0){
                    console.log('Get Minimum')
                    snapshot.forEach((childSnapshot: any) => {     

                        const item = childSnapshot.val()
                        console.log('item:',item)
                        item.key = childSnapshot.key
                        const PlantGot =query(ref(db, 'Master/'+ 'Plants/' +item.PlantID));
                    
                        onValue(PlantGot,(snapshot)=> {
                            if(snapshot.val().Rarity==3){
                                // weights.push(item.Prob)
                                results.push(item.PlantID)
                            }
                        });

                    });
                    console.log(results.length)
                    const eachPercent =1/results.length
                    console.log('eachPercent :',eachPercent)
                    snapshot.forEach((childSnapshot: any) => {     
                             weights.push(eachPercent)
                    });
                }else{
                    console.log('Normal')
                    snapshot.forEach((childSnapshot: any) => {     
                        const item = childSnapshot.val()
                        //console.log('item:',item)
                        item.key = childSnapshot.key
                        weights.push(item.Prob)
                        results.push(item.PlantID)
                    });
                }

                console.log(weights)
                console.log(results)
                const Key2 =getRandom()
                //console.log('PlantID :', Key2)

                const InventoryData ={
                    PlantID :Key2,
                    IsPlanted :false
                }
                const newPostKey = push(child(ref(db), 'Inventory/'+UID)).key;
                update(ref(db,'/Inventory/' + UID + '/' + newPostKey), InventoryData).then(() => {
                    // Data saved successfully!
                    console.log('Inventory Added Updated')
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

                const PlantGot =query(ref(db, 'Master/'+ 'Plants/' +Key2));
                
                onValue(PlantGot,(snapshot)=> {
                    // console.log('a :',snapshot.val())
                    if (snapshot.exists()) {
                    //   console.log('Plant Key Data',snapshot.val());
                      setShowModalGacha(true);
                      SetPlantID(snapshot.val().key)
                      SetPlantName(snapshot.val().Name)
                      setRarity(snapshot.val().Rarity)
                      SetPlantImg(snapshot.val().Image)
                    } else {
                      console.log("No data available");
                    }
                },{
                    onlyOnce: true
                });

            });
        }
    }




return(
    <IonPage>
            {isPlatform('desktop') && (
                <IonToolbar>
                    <IonRow class='ion-justify-content-center'>
                        <IonText>Schedule</IonText>
                    </IonRow>
                </IonToolbar>
            )}
        <IonContent  class='LoginandRegis'>
            <IonGrid>
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
                            <IonImg src={SummonTicketImg} class='ImgTicket' />
                            <IonText>
                                Summon Ticket : {SummonTicket}
                            </IonText>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem class='ListInvisBack'>
                        <IonImg src={FieldTicketImg} class='ImgTicket' />
                            <IonText>
                               Field Ticket : {FieldTicket}
                            </IonText>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol class='ListInvisBack'>
                        {/* <IonItem class='ListInvisBack'>
                            <IonCol> */}
                                <IonRow class='ion-justify-content-center'>
                                    <IonImg  src={AltarImg}/>
                                </IonRow>
                                <IonRow class='ion-justify-content-center'>
                                    <IonButton onClick={SummonPlant} >
                                        summon
                                    </IonButton>
                                    <IonButton onClick={ClaimFieldTicket}>
                                        Exchange Ticket
                                    </IonButton>
                                </IonRow>
                            {/* </IonCol>
                        </IonItem> */}
                    </IonCol>
                </IonRow>
                <IonRow>
                    <InventoryList UID={UID}/>
                </IonRow>
            </IonGrid>     
        </IonContent>


        <IonModal class='modal-wrapper3' trigger="trigger-button-Gatcha" isOpen={showModalGacha} showBackdrop={false} onDidDismiss={() => setShowModalGacha(false)}>
            <IonContent>
                <IonRow>
                    <IonCol>
                        <IonLabel>Congrats You Get A PLant </IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel > Name :{PLantName} </IonLabel>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonCol>
                                <IonRow class='ion-justify-content-center'>
                                    <IonImg src={PLantImg} class='ImgGotGacha'/> 
                                </IonRow>
                        {/* </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem> */}
                                {/* <IonLabel > Rarity :{Rarity} </IonLabel> */}
                                {Rarity==1 && (
                                    <IonRow class='ion-justify-content-center'>
                                        <IonIcon src={star} size='large'></IonIcon>    
                                    </IonRow>
                                )}
                                {Rarity==2 && (
                                    <IonRow class='ion-justify-content-center'>
                                        <IonIcon src={star} size='large'/>
                                        <IonIcon src={star} size='large'/>
                                    </IonRow>
                                )}                   
                                {Rarity==3 && (
                                    <IonRow class='ion-justify-content-center'>
                                        <IonIcon src={star} size='large'/>
                                        <IonIcon src={star} size='large'/>
                                        <IonIcon src={star} size='large'/>
                                    </IonRow>
                                )}
                            </IonCol>
                            
                            
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow >
                    <IonCol >
                        <IonRow class='ion-justify-content-center'>

                        <IonButton onClick={() => setShowModalGacha(false)}> OK</IonButton>
                        </IonRow>
                    </IonCol>
                    {/* <IonCol  class="ion-align-self-center">
                        <IonButton onClick={() => setShowModal(false)}> Cancel</IonButton>
                    </IonCol> */}
                </IonRow>
            </IonContent>
        </IonModal>

        <IonAlert
                    isOpen={showAlert1}
                    onDidDismiss={() => setShowAlert1(false)}
                    cssClass='my-custom-class'
                    header={ErrorCode}
                    message={ErrorMessage}
                    buttons={['OK']}
        />
    </IonPage>
)   
};
export default Gatcha;