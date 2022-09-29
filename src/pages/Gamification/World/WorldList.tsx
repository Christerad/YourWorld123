import { IonContent, IonHeader, IonPage, IonRow, IonCol, IonImg, IonText, IonLabel,IonLoading, IonItemOption, IonRange
    ,IonItem, IonList, IonItemSliding, IonItemOptions, IonChip, IonAlert, IonGrid, IonModal, IonButton, getPlatforms} from '@ionic/react';
import { IonIcon,isPlatform } from '@ionic/react';
import {calendar, add, bookSharp, schoolSharp ,documentsSharp , clipboard, checkmarkCircle,closeCircle, watchOutline, key, keyOutline, star} from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';


import './World.css'
import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo} from "firebase/database";

import WorldFormInventory from './WorldFormInventoryList'

const WorldList: React.FC<{UID :string}> = (props) => {
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

    const RemovePlantFromField=(FieldKey :string,ItemKey:string)=>{
      const WorldData = {
          IsPlanted:false,
          PlantID : '', 
          Link_Inven : ''
      };

      // console.log('Field key  :',FieldKey)
      // console.log('InvenKey   :',ItemKey)

     console.log('data :',WorldData)

      update(ref(db,'/World/' + props.UID + '/Fields/'  + FieldKey), WorldData).then(() => {
          // Data saved successfully!
          console.log('Plant Removed on Field')
      })
      .catch((error) => {
          // The write failed...
          console.log('Error code :',error.code)
          console.log('Error Message :',error.message)
          SetErrorCode(error.message);
          SetErrorMessage(error.message);
          setShowAlert1(true)
      });

      const InvenData = {
          IsPlanted     :false
      };


      console.log('data :',InvenData)

      update(ref(db,'/Inventory/' + props.UID + '/' + ItemKey), InvenData).then(() => {
          // Data saved successfully!
          console.log('Plant status changed on Inventory')
      })
      .catch((error) => {
          // The write failed...
          console.log('Error code :',error.code)
          console.log('Error Message :',error.message)
          SetErrorCode(error.message);
          SetErrorMessage(error.message);
          setShowAlert1(true)
      });
    }

    const OpenField=(Key : string)=>{
      console.log(Key)
        const ref1 = ref(db, 'World/' + props.UID +'/Fields/' + Key);
        onValue(ref1, (snapshot) => {
            console.log('Isplanted ? :',snapshot.val().Isplanted)
            if(snapshot.val().IsPlanted==true){
              SetIsPlanted(true)
              SetIsnotPlanted(false)
            }else{
              SetIsnotPlanted(true)
              SetIsPlanted(false)
            }

            const MasterData =query(ref(db, 'Master/Plants/'+  snapshot.val().PlantID));
            onValue(MasterData, (MasterShot) => {
              if(MasterShot.exists()){
                
                 console.log('Master Data Found:',MasterShot.key)
                // console.log('masterShot key :',MasterShot.key)
                // console.log('masterShot Val:',MasterShot.val())

                SetPlantName(MasterShot.val().Name)
                SetRarity(MasterShot.val().Rarity)
                SetImage(MasterShot.val().Image)
                SetFieldID(Key)
                SetInvenID(snapshot.val().Link_Inven)
                console.log('Inven ID',InvenID)
                console.log('Field ID',FieldID)


              }else{
                console.log('Data Not Exist')
              }     
            });
          });
      setShowModalOpenField(true)
    }

    const snapshotToArray = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => {     
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
                    //console.log('s', returnArr.length)    
                    ///console.log(returnArr.length)
                    
                    // console.log('Array Item :',data1)
                    // console.log('Array Item Length :',data1.length)
            });

          //returnArr.push(item)
        });
        return returnArr;
    }

    const loadData = () => { 

      console.log('platforms :',getPlatforms())
      console.log('mobile? ',isPlatform('mobile'))
      console.log('desktop? ',isPlatform('desktop'))
      const MasterData =query(ref(db, 'Master/Plants'));

      onValue(MasterData, (MasterShot) => {
      });

      const mostViewedPosts =query(ref(db, 'World/'+props.UID+'/Fields'));
      onValue(mostViewedPosts, (snapshot) => {
        //console.log( 'val snapshost :',snapshot.val())
          let data1 = snapshotToArray(snapshot) 
          //console.log('Data :',data1)
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
      }, [props.UID])
      
    if(isPlatform('mobile')){
    return(             
      <IonGrid class='img-grid-mobile'>
        {IsEmpty && (
          <IonCol>
            No Data Available
          </IonCol>
        )}


        {data && data.map((item) => (
          <IonCol class='Colbackground'>
              <IonItem key={item.key}  id='Open-Field' onClick={() =>OpenField(item.key) }  class='Field-mobile'>
                {/* <IonRow> */}
                  {/* <IonImg src='https://media.istockphoto.com/vectors/geometrical-square-mosaic-background-vector-design-from-squares-in-vector-id854658390?k=20&m=854658390&s=612x612&w=0&h=LunJSDeswTeQYYYoKKn4XrEzJ3QTcns8dNjGtKlB7Kc=' />   */}
                {/* </IonRow> */}
                {item.PlantID && (
                  <IonCol>
                    <IonRow class='ion-justify-content-center'>
                      <IonImg src={item.Image} class='ImgListPlant' />
                    </IonRow>

                    <IonRow class='ion-justify-content-center'>
                      <IonText>
                        {/* PLantID :{item.PlantID} */}
                        {item.Name}
                      </IonText>
                    </IonRow>

                    {/* Rarity : {item.Rarity} */}
                    {item.Rarity===1 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon class='StarIcon-Mobile' src={star}></IonIcon>    
                        </IonRow>
                    )}
                    {item.Rarity===2 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon class='StarIcon-Mobile' src={star}/>
                            <IonIcon class='StarIcon-Mobile' src={star}/>
                        </IonRow>
                    )}                   
                    {item.Rarity===3 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon class='StarIcon-Mobile' src={star}/>
                            <IonIcon class='StarIcon-Mobile' src={star}/>
                            <IonIcon class='StarIcon-Mobile' src={star}/>
                        </IonRow>
                    )}
                  </IonCol>
                )}

              </IonItem>
          </IonCol>
        ))}
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
      <IonModal class='modal-wrapper1' trigger="Open-Field" isOpen={showModalOpenField} showBackdrop={true} onDidDismiss={()=>setShowModalOpenField(false)}>
          <IonContent class='FormInven2'>
            {Isnotplanted && (
              <IonContent>
                <IonRow class='ion-justify-content-center'>
                  <IonItem>
                    <IonLabel> Select Plant that you want to plant on the field </IonLabel>
                  </IonItem>
                </IonRow>
                <IonRow>
                  <WorldFormInventory UID={props.UID} FieldKey={FieldID}/>
                </IonRow>
                <IonRow>
                  <IonCol  class="ion-align-self-center" >
                      <IonButton onClick={()=>setShowModalOpenField(false)}> Cancel</IonButton>
                  </IonCol>
                </IonRow>
              </IonContent>
            )}
            {Isplanted&&(
              <IonContent>
                <IonCol>
                  <IonRow class='ion-justify-content-center'>
                        <IonImg src={Image}  class='ImgSelectedPlant'/>
                  </IonRow>
                  <IonRow class='ion-justify-content-center'>
                        Plant Name :{PlantName}
                  </IonRow>
                  {Rarity==1 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon src={star}></IonIcon>    
                        </IonRow>
                    )}
                    {Rarity==2 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon src={star}/>
                            <IonIcon src={star}/>
                        </IonRow>
                    )}                   
                    {Rarity==3 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon src={star}/>
                            <IonIcon src={star}/>
                            <IonIcon src={star}/>
                        </IonRow>
                    )}
                  <IonRow>
                    <IonCol  >
                        <IonRow class='ion-justify-content-center'>
                          <IonButton onClick={()=>RemovePlantFromField(FieldID,InvenID)}> Remove Plant from Field ? </IonButton>
                        </IonRow>
                    </IonCol>
                    <IonCol  >
                      <IonRow class='ion-justify-content-center'>
                        <IonButton onClick={()=>setShowModalOpenField(false) }> Cancel</IonButton>
                      </IonRow>
                    </IonCol>
                  </IonRow>
                </IonCol>
                
              </IonContent>
            )}
          </IonContent>
      </IonModal>
      </IonGrid>  
    )
  }else {
    return(
      <IonGrid class='img-grid-desktop'>
        {IsEmpty && (
          <IonCol>
            No Data Available
          </IonCol>
        )}


        {data && data.map((item) => (
          <IonCol class='Colbackground'>
              <IonItem key={item.key}  id='Open-Field' onClick={() =>OpenField(item.key) }  class='FieldWorldItem'>
                {/* <IonRow> */}
                  {/* <IonImg src='https://media.istockphoto.com/vectors/geometrical-square-mosaic-background-vector-design-from-squares-in-vector-id854658390?k=20&m=854658390&s=612x612&w=0&h=LunJSDeswTeQYYYoKKn4XrEzJ3QTcns8dNjGtKlB7Kc=' />   */}
                {/* </IonRow> */}
                {item.PlantID && (
                  <IonCol>
                    <IonRow class='ion-justify-content-center'>
                      <IonImg src={item.Image} class='ImgListPlant1' />
                    </IonRow>

                    <IonRow class='ion-justify-content-center'>
                      <IonText>
                        {/* PLantID :{item.PlantID} */}
                        {item.Name}
                      </IonText>
                    </IonRow>

                    {/* Rarity : {item.Rarity} */}
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
    <IonModal class='modal-wrapper1' trigger="Open-Field" isOpen={showModalOpenField} showBackdrop={true} onDidDismiss={()=>setShowModalOpenField(false)}>
          <IonContent>
            {Isnotplanted && (
              <IonContent>
                <IonRow class='ion-justify-content-center'>
                  <IonItem>
                    <IonLabel> Select Plant that you want to plant on the field </IonLabel>
                  </IonItem>
                </IonRow>
                <IonRow>
                  <WorldFormInventory UID={props.UID} FieldKey={FieldID}/>
                </IonRow>
                <IonRow>
                  <IonCol  class="ion-align-self-center" >
                      <IonButton onClick={()=>setShowModalOpenField(false)}> Cancel</IonButton>
                  </IonCol>
                </IonRow>
              </IonContent>
            )}
            {Isplanted&&(
              <IonContent>
                <IonCol>
                  <IonRow class='ion-justify-content-center'>
                        <IonImg src={Image}  class='ImgSelectedPlant'/>
                  </IonRow>
                  <IonRow class='ion-justify-content-center'>
                        Plant Name :{PlantName}
                  </IonRow>
                  {Rarity===1 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon src={star}></IonIcon>    
                        </IonRow>
                    )}
                    {Rarity===2 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon src={star}/>
                            <IonIcon src={star}/>
                        </IonRow>
                    )}                   
                    {Rarity===3 && (
                        <IonRow class='ion-justify-content-center'>
                            <IonIcon src={star}/>
                            <IonIcon src={star}/>
                            <IonIcon src={star}/>
                        </IonRow>
                    )}
                  <IonRow>
                    <IonCol  >
                        <IonRow class='ion-justify-content-center'>
                          <IonButton onClick={()=>RemovePlantFromField(FieldID,InvenID)}> Remove Plant from Field ? </IonButton>
                        </IonRow>
                    </IonCol>
                    <IonCol  >
                      <IonRow class='ion-justify-content-center'>
                        <IonButton onClick={()=>setShowModalOpenField(false) }> Cancel</IonButton>
                      </IonRow>
                    </IonCol>
                  </IonRow>
                </IonCol>
                
              </IonContent>
            )}
            

          </IonContent>
      </IonModal>
      </IonGrid>  
    )
  }
};
export default WorldList;