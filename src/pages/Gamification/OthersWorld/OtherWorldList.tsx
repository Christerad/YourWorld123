import { IonContent, IonHeader, IonPage, IonRow, IonCol, IonImg, IonText, IonLabel,IonLoading, IonItemOption, IonRange
    ,IonItem, IonList, IonItemSliding, IonItemOptions, IonChip, IonAlert, IonGrid, IonModal, IonButton, IonToolbar, IonButtons, IonBackButton} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import {calendar, add, bookSharp, schoolSharp ,documentsSharp , clipboard, checkmarkCircle,closeCircle, watchOutline, key, keyOutline, star} from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';


import './OtherWorld.css'

import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo} from "firebase/database";
import { isPlatform } from '@ionic/core';


const OtherWorldList: React.FC<{UID :string}> = (props) => {
    //console.log('WorldList,UID :',props.UID)
    const [data, setData] = useState<any[]>([])

    const formatDate = (value: string) => {
      return format(parseISO(value), 'dd MMM yyyy');
    }
    const [IsEmpty,setIsEmpty]=useState(true)

    const [showLoading, setShowLoading] = useState(true);
    const [showAlert1, setShowAlert1] = useState(false);
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')

    const [showModalOpenField, setShowModalOpenField] = useState(false);

    const [Isplanted,SetIsPlanted]=useState<boolean>(); 
    const [Isnotplanted,SetIsnotPlanted]=useState<boolean>();
    const [PlantName, SetPlantName] = useState('');
    const [PlantID, SetPlantID] = useState('');
    const [Rarity,SetRarity]=useState<Number>()
    const [Image,SetImage]=useState('')
    const [FieldID,SetFieldID]=useState('')
    const [InvenID,SetInvenID]=useState('')

    const db = getDatabase();

    const snapshotToArray = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => { 
          // console.log('childkey :',childSnapshot.key)
          // console.log('val :',childSnapshot.val())
          const item = childSnapshot.val()
          item.key = childSnapshot.key

          const MasterData =query(ref(db, 'Master/' + 'Plants/' +childSnapshot.val().PlantID));

            onValue(MasterData, (MasterShot) => {
                    
                    const item ={ 
                        PlantID :childSnapshot.val().PlantID,
                        key     :childSnapshot.key,
                        Image   :MasterShot.val().Image,
                        Rarity  :MasterShot.val().Rarity,
                        Name    :MasterShot.val().Name
                    }
        
                    returnArr.push(item)
                    // console.log('s', returnArr.length)    
                    // console.log(returnArr.length)
              
            });

          //returnArr.push(item)
        });
        return returnArr;
    }

    const loadData = () => { 
      const MasterData =query(ref(db, 'Master/Plants'));

      onValue(MasterData, (MasterShot) => {
      });

      const mostViewedPosts =query(ref(db, 'World/'+props.UID+'/Fields'));
      onValue(mostViewedPosts, (snapshot) => {
          let data1 = snapshotToArray(snapshot) 
          setData(data1)
          setShowLoading(false);

          if(data1.length!=0){
            setIsEmpty(false)
          }
          else {
            setIsEmpty(true)
          }
          
      });
    }
    useEffect(() => {
        loadData()
      }, [showLoading])

   if(isPlatform('mobile')){
    return(
      <IonList class='ListBackInvis'>
      <IonRow>
        <IonCol>
          <IonRow>

            <IonGrid class='img-grid-mobile'>
            {IsEmpty && (
              <IonCol>
                No Data Available
              </IonCol>
            )}
              {data && data.map((item) => (
              <IonCol class='Colbackground'>

                  <IonItem key={item.key} class='Field-mobile' id='Open-Field'>
                    {/* <IonRow> */}
                      {/* <IonImg src='https://media.istockphoto.com/vectors/geometrical-square-mosaic-background-vector-design-from-squares-in-vector-id854658390?k=20&m=854658390&s=612x612&w=0&h=LunJSDeswTeQYYYoKKn4XrEzJ3QTcns8dNjGtKlB7Kc=' />   */}
                    {/* </IonRow> */}
                    {item.PlantID && (
                      <IonCol>
                        <IonRow class='ion-justify-content-center'>
                          <IonImg src={item.Image}/>
                        </IonRow>
                        <IonRow class='ion-justify-content-center'>
                          <IonText>
                            {/* PLantID :{item.PlantID} */}
                            {item.Name}
                          </IonText>
                        </IonRow>

                        {item.Rarity==1 && (
                            <IonRow class='ion-justify-content-center'>
                                <IonIcon  src={star}></IonIcon>    
                            </IonRow>
                        )}
                        {item.Rarity==2 && (
                            <IonRow class='ion-justify-content-center'>
                                <IonIcon  src={star}/>
                                <IonIcon  src={star}/>
                            </IonRow>
                        )}                   
                        {item.Rarity==3 && (
                            <IonRow class='ion-justify-content-center'>
                                <IonIcon src={star}/>
                                <IonIcon  src={star}/>
                                <IonIcon  src={star}/>
                            </IonRow>
                        )}
                      </IonCol>
                    )}
   
                  </IonItem>
              </IonCol>
              ))}
            </IonGrid>
          </IonRow>
        </IonCol>
      </IonRow>
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Loading...'}
    />
    <IonAlert
      isOpen={showAlert1}
      onDidDismiss={() => setShowAlert1(false)}
      cssClass='my-custom-class'
      header={ErrorCode}
      message={ErrorMessage}
      buttons={['OK']}
    />
    </IonList>
    )
   }   
    else{
    return(
        <IonList class='ListBackInvis'>
          <IonRow>
            <IonCol>
              <IonRow>
  
                <IonGrid class='img-grid-desktop'>
                {IsEmpty && (
                  <IonCol>
                    No Data Available
                  </IonCol>
                )}
                  {data && data.map((item) => (
                  <IonCol class='Colbackground'>

                      <IonItem key={item.key} class='FieldWorldItem' id='Open-Field'>
                        {/* <IonRow> */}
                          {/* <IonImg src='https://media.istockphoto.com/vectors/geometrical-square-mosaic-background-vector-design-from-squares-in-vector-id854658390?k=20&m=854658390&s=612x612&w=0&h=LunJSDeswTeQYYYoKKn4XrEzJ3QTcns8dNjGtKlB7Kc=' />   */}
                        {/* </IonRow> */}
                        {item.PlantID && (
                          <IonCol>
                            <IonRow class='ion-justify-content-center'>
                              <IonImg src={item.Image}/>
                            </IonRow>
                            <IonRow class='ion-justify-content-center'>
                              <IonText>
                                {/* PLantID :{item.PlantID} */}
                                {item.Name}
                               </IonText>
                            </IonRow>

                            {item.Rarity==1 && (
                                <IonRow class='ion-justify-content-center'>
                                    <IonIcon src={star}></IonIcon>    
                                </IonRow>
                            )}
                            {item.Rarity==2 && (
                                <IonRow class='ion-justify-content-center'>
                                    <IonIcon src={star}/>
                                    <IonIcon src={star}/>
                                </IonRow>
                            )}                   
                            {item.Rarity==3 && (
                                <IonRow class='ion-justify-content-center'>
                                    <IonIcon src={star}/>
                                    <IonIcon src={star}/>
                                    <IonIcon src={star}/>
                                </IonRow>
                            )}
                          </IonCol>
                        )}
       
                      </IonItem>
                  </IonCol>
                  ))}
                </IonGrid>            
              </IonRow>
            </IonCol>
          </IonRow>
          <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
        />
        <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          cssClass='my-custom-class'
          header={ErrorCode}
          message={ErrorMessage}
          buttons={['OK']}
        />
        </IonList>
    )
  }
};
export default OtherWorldList;