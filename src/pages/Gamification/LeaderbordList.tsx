import { IonContent, IonHeader, IonPage, IonRow, IonCol, IonImg, IonText, IonLabel
    ,IonItem, IonList, IonButton, IonModal, IonLoading, IonItemOptions, IonItemOption, IonItemSliding} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { personCircle,calendar, documentText, podium, trophy, globe, arrowBack } from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, query, onValue, orderByChild} from "firebase/database";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import OtherWorld from './OthersWorld/OtherWorld';
import LevelController from '../Controller/LevelController'
import ExperienceController from '../Controller/ExperienceController';

import './LeaderboardList.css'

import GoldTrophy from '../../components/Image/GoldThrophy.png'
import SilverTrophy from '../../components/Image/SilverThrophy.png'
import CopperTrophy from '../../components/Image/CopperThrophy.png'

const LeaderboardList: React.FC <{UID :string}>= (props) => {
    // console.log('Opening LeaderboardList')
    const [data, setData] = useState<any[]>([])
    const [showLoading, setShowLoading] = useState(true);
    const [OtherUID,SetOtherUID]=useState<string>('')
    const [UsernameOther, SetUsernameOther] = useState<string | any>()
    const [LevelOther, SetLevelOther] = useState<Number | any>()
    const [XPOther, SetXPOther] = useState<Number| any>()
    
    const [showModalWorld, setShowModalWorld] = useState(false);
    const ref2 = useRef<any>(null);
    
    const history = useHistory();

    async function OpenModal(UID : string){
      console.log('UID SELECTED :',UID)
      setShowModalWorld(true)
      SetOtherUID(UID)
      console.log('Other UID :',OtherUID );
  }

  const CloseModal =(data:boolean)=>{
    console.log('closing modal')
    setShowModalWorld(data)

}


  function OpenModal2(UID: string){
    console.log('UID SELECTED :',UID)
    SetOtherUID(UID)
    console.log('Other UID :',OtherUID );

}

    const db = getDatabase();
    const mostViewedPosts =query(ref(db, 'users'), orderByChild('Level'));

    const snapshotToArray = (snapshot: any) => {
        const returnArr: any[] = []
      
        snapshot.forEach((childSnapshot: any) => {
         // console.log(childSnapshot.val())
          const item = childSnapshot.val()
          item.key = childSnapshot.key
          returnArr.push(item)
          
        });
        return returnArr;
    }

    const loadData = () => { 

        onValue(mostViewedPosts, (snapshot) => {
            // console.log(snapshot.val())
            let data1 = snapshotToArray(snapshot) 
            // console.log('data :',data1)
            // console.log('total N :',data1.length)
            // console.log('data 1 level:',data1[0].Level)

            for (let i = 0; i < data1.length; i++) {
              for (let j = i + 1; j < data1.length; ++j) 
              {
                // const return2=(data1[i].Level < data1[j].Level) || ((data1[i].Level = data1[j].Level)&& data1[i].XP < data1[j].XP)
                // console.log('return2 :', return2)
                // console.log(data1[i].Level+' < ' +data1[j].Level, '||(' ,data1[i].Level ,'= ',data1[j].Level,' && ',data1[i].XP ,'<', data1[j].XP +')')
                if ((data1[i].Level < data1[j].Level) || ((data1[i].Level = data1[j].Level)&& data1[i].XP < data1[j].XP)) 
                {
                    //  console.log('swapping')
                     let a = data1[i];
                     data1[i] = data1[j];
                     data1[j] = a;
                }
              }
            }
            // console.log('data 1 level After count0: ',data1[0].Level)
            // console.log('data 1 level After count1: ',data1[1].Level)
            setData(data1)
            setShowLoading(false);
        });

    }

    useEffect(() => {
        loadData()
      }, [])

    return(
        <IonList class='blurred-box'>
          {data.map((item, idx) => (
            <IonItemSliding id="ion-item-sliding" key={idx} class='IonItemRoundedDoang'>
              <IonItem class='CircleBackground'>
                <IonCol size='8'>
                  <IonRow> <IonText class='UsernameFont'>{item.username}</IonText></IonRow>
                  <IonRow> <IonText class='Emailsize'> {item.email}</IonText></IonRow>
                  <IonRow> <IonText>level: {item.Level}</IonText></IonRow>
                  <IonRow> <IonText>xp: {item.XP}</IonText></IonRow>
                  {/* <IonLabel>
                    <h3>email: {item.email}</h3>
                    <h3>level: {item.Level}</h3>
                    <h3>xp: {item.XP}</h3>
                  </IonLabel> */}
                </IonCol>
                <IonCol class='col2'>
                  <IonText> Rank {idx+1}</IonText>       
                </IonCol>
                <IonCol  >
                    {idx==0 &&(
                      // <IonLabel> Medal Gold</IonLabel>
                      <IonImg class='ImgThrophy' src={GoldTrophy}/>
                    )}
                    {idx==1 &&(
                      <IonImg class='ImgThrophy' src={SilverTrophy}/>
                    )}
                    {idx==2 &&(
                      <IonImg class='ImgThrophy' src={CopperTrophy}/>
                    )}
                </IonCol>

              </IonItem>
              <IonItemOptions side="start" class='IonItemRoundedDoang'>
                <IonItemOption id="trigger-button-World" onClick={()=>OpenModal(item.key)}>
                  <IonIcon src={globe}/>
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        <IonModal trigger="trigger-button-World" isOpen={showModalWorld} showBackdrop={true} onDidDismiss={()=>setShowModalWorld(false)} class="modal-wrapper4">
            <IonRow >
                <IonCol slot='start'>
                    <IonIcon src={arrowBack} size='large'  onClick={()=>setShowModalWorld(false)}/>
                </IonCol>
                <IonCol>
                    <IonRow>
                        <IonText>{UsernameOther} </IonText>
                    </IonRow>
                    <IonRow>
                        <LevelController LvL={LevelOther} />
                    </IonRow>
                    <ExperienceController LvL={LevelOther} XP={XPOther} MaxXP={LevelOther*3} />
                </IonCol> 
            </IonRow>
            <OtherWorld OtherUID={OtherUID} CurrUID={props.UID} CloseModal={CloseModal} />
        </IonModal>          
        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
        />

        </IonList>
    )
};
export default LeaderboardList;