import { IonContent, IonHeader, IonPage, IonRow, IonCol, IonImg, IonText, IonLabel,IonLoading, IonItemOption, IonRange
    ,IonItem, IonList, IonItemSliding, IonItemOptions, IonChip, IonAlert, IonGrid} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import {star} from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { isEmpty } from '@firebase/util';

import "./InventoryList.css"
import { isPlatform } from '@ionic/core';

const InventoryList: React.FC<{UID :string}> = (props) => {
    const [IsEmpty,setIsEmpty]=useState(true)

    const [showLoading, setShowLoading] = useState(true);
    const [showAlert1, setShowAlert1] = useState(false);
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')
    const PlantIMG=useRef('')
    const PLantRarity=useRef(0)

    const [dataInven, setDataInven] = useState<any[]>([])

    
    const [dataItem, setDataItem] = useState<any[]>([])

    const [showModal, setShowModal] = useState(false);

    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();

    const snapshotToArray = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => {     
          const item = childSnapshot.val()
          item.key = childSnapshot.key
          returnArr.push(item)
        });
        return returnArr;
    }

    const snapshotToArray2 = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach( (childSnapshot: any) => {
            // console.log('1')

            const MasterData =query(ref(db, 'Master/' + 'Plants/' +childSnapshot.val().PlantID));

            onValue(MasterData, (MasterShot) => {
                    console.log('Mastershot key :',MasterShot.key)
                    // let data1 = snapshotToArray(MasterShot)
                    // setDataItem(data1) 
                    console.log('Plant IMG :',MasterShot.val().Image)
                    console.log('Plant Rarity :',MasterShot.val().Rarity)
                    
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
                    
                    // console.log('Array Item :',data1)
                    // console.log('Array Item Length :',data1.length)
            });
            //     console.log('Snapshot key :',MasterShot.key)
            //     console.log('Plant IMG :',MasterShot.val().Image)
            //     console.log('Plant Rarity :',MasterShot.val().Rarity)


                

        });

        // console.log('55555 :',returnArr);
        return returnArr;
    }

    const loadData = () => { 
        const MasterData =query(ref(db, 'Master/Plants'));

        onValue(MasterData, (MasterShot) => {
                // console.log('Snapshot key :',MasterShot.key)
                let data1 = snapshotToArray(MasterShot)
                setDataItem(data1)
                // console.log('Array Item :',data1)
                // console.log('Array Item Length :',data1.length)
        });
        



        const mostViewedPosts =query(ref(db, 'Inventory/'+props.UID));
        onValue(mostViewedPosts, (snapshot) => {
            // console.log('Snapshot key :',snapshot.key)
            let data2 = snapshotToArray2(snapshot) 
            // console.log('Data1 :',data2)
            setDataInven(data2)
            setShowLoading(false);

            
            // console.log('Length Data:',data2.length)
  
            if(data2.length!=0){
              setIsEmpty(false)
            }
            else {
              setIsEmpty(true)
            }
            
        });

      }
      useEffect(() => {
          loadData()
        }, [props.UID])
if(isPlatform('mobile')){
    return(
    <IonGrid class='inv-grid-mobile'>
        {IsEmpty && (
            <IonCol>
                No Data Available
            </IonCol>
        )}
        {dataInven.map((item) => (
            <IonCol>
                <IonItem key={item.key} class='Inven' id='Open-Field'>       
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>
                            <IonImg src={item.Image}/>  
                        </IonRow>
                        {/* <IonRow>
                            <h2>PLantID :{item.PlantID}</h2>
                        </IonRow> */}
                        <IonRow class='ion-justify-content-center'>
                            <IonText class='Text-Mobile'>
                                {item.Name}
                            </IonText>
                        </IonRow>
                        {/* <IonRow>
                            PLantID :{item.PlantID}
                        </IonRow> */}
                        
                            {item.Rarity==1 && (
                                <IonRow class='ion-justify-content-center'>
                                    <IonIcon class='StarIcon-Mobile' src={star}></IonIcon>    
                                </IonRow>
                            )}
                            {item.Rarity==2 && (
                                <IonRow class='ion-justify-content-center'>
                                    <IonIcon class='StarIcon-Mobile' src={star}/>
                                    <IonIcon class='StarIcon-Mobile' src={star}/>
                                </IonRow>
                            )}                   
                            {item.Rarity==3 && (
                                <IonRow class='ion-justify-content-center'>
                                    <IonIcon class='StarIcon-Mobile' src={star}/>
                                    <IonIcon class='StarIcon-Mobile' src={star}/>
                                    <IonIcon class='StarIcon-Mobile' src={star}/>
                                </IonRow>
                            )}
                            {/* Rarity : {item.Rarity} */}
                        
                    </IonCol>
                </IonItem>
            </IonCol>
        ))}

        <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          cssClass='my-custom-class'
          header={ErrorCode}
          message={ErrorMessage}
          buttons={['OK']}
        />
        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
        />
    </IonGrid>
    )
}else{
return(
    <IonGrid class='inv-grid-dekstop'>
        {IsEmpty && (
            <IonCol>
                No Data Available
            </IonCol>
        )}
        {dataInven.map((item) => (
            <IonCol>
                <IonItem key={item.key} class='Inven' id='Open-Field'>       
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>
                            <IonImg src={item.Image}/>  
                        </IonRow>
                        {/* <IonRow>
                            <h2>PLantID :{item.PlantID}</h2>
                        </IonRow> */}
                        <IonRow class='ion-justify-content-center'>
                            <IonText class='Text-Desktop'>
                                {item.Name}
                            </IonText>
                        </IonRow>
                        {/* <IonRow>
                            PLantID :{item.PlantID}
                        </IonRow> */}
                        
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
                            {/* Rarity : {item.Rarity} */}
                        
                    </IonCol>
                </IonItem>
            </IonCol>
        ))}

        <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          cssClass='my-custom-class'
          header={ErrorCode}
          message={ErrorMessage}
          buttons={['OK']}
        />
        <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
        />
    </IonGrid>
    )}
};
export default InventoryList;