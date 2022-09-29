import { IonContent, IonHeader, IonPage, IonRow, IonCol, IonImg, IonText, IonLabel,IonLoading, IonItemOption, IonRange
    ,IonItem, IonList, IonItemSliding, IonItemOptions, IonChip, IonAlert, IonGrid, isPlatform} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import {calendar, add, bookSharp, schoolSharp ,documentsSharp , clipboard, checkmarkCircle,closeCircle, watchOutline} from "ionicons/icons";
import React, { useState, useRef, useEffect ,SetStateAction} from 'react';
import { format, parseISO,startOfWeek ,endOfWeek,startOfDay } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo, startAt, endAt, onChildAdded, onChildRemoved, onChildChanged} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getPlatforms } from '@ionic/core';


const ScheduleList: React.FC<{UID :string}> = (props) => {
    // console.log('TodoList,UID :',props.UID)
    const [data, setData] = useState<any[]>([])

    const formatDate = (value: string) => {
      return format(parseISO(value), 'dd MMM yyyy');
    }


    const [IsEmpty,setIsEmpty]=useState(true)

    const [Currdate,SetCurrdate]=useState('')
    const [StartWeekdate,SetStartWeekdate]=useState('')
    const [EndWeekdate,SetEndWeekdate]=useState('')


    const [showLoading, setShowLoading] = useState(true);
    const [showAlert1, setShowAlert1] = useState(false);
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')

    const CurrentLevel  = useRef<number | any>()
    const CurrentXP  = useRef<number | any>() 
    const MaxXP  = useRef<number | any>()
    const MultiPlier=useRef<number | any>()

    const TaskCount=useRef<number | any>()
    const StudyCount=useRef<number | any>()
    const ClassCount=useRef<number | any>()
    const TestCount=useRef<number | any>()
    const HomeworkCount=useRef<number | any>()

    const StudyTag=useRef<Boolean>()
    const ClassTag=useRef<Boolean>()
    const TestTag=useRef<Boolean>()
    const HomeworkTag=useRef<Boolean>()

    const db = getDatabase();

    function getCurrentDate(){

      let CurrDate = startOfDay (new Date())
      SetCurrdate(format(CurrDate,'yyy-MM-dd'))
      // console.log('Curr Date :',format(CurrDate,'yyy-MM-dd'))
      let StartWeekDate =startOfWeek(CurrDate)
      SetStartWeekdate(format(StartWeekDate,'yyy-MM-dd'))
      //console.log('StartOfWeek Date :',format(StartWeekDate,'dd-MM-yyy'))
      let EndWeekDate= endOfWeek(CurrDate)
      SetEndWeekdate(format(EndWeekDate,'yyy-MM-dd'))
      //console.log('EndOfWeek Date :',format(EndWeekDate,'dd-MM-yyy'))
      }

    async function IsLevelUP () {
      console.log('checking levelup')
      CurrentXP.current=CurrentXP.current+MultiPlier.current

      while (CurrentXP.current >= MaxXP.current){
        console.log('XP OverFlow')
        CurrentLevel.current=CurrentLevel.current+1
        console.log('Level :',CurrentLevel.current)
        CurrentXP.current = CurrentXP.current- MaxXP.current
        console.log('XP :',CurrentXP.current)
        MaxXP.current=CurrentLevel.current*3
        console.log('MaxXP :',MaxXP.current)
      }

      const LevelUPData ={
        Level : CurrentLevel.current
        ,XP: CurrentXP.current
      }

      const res1 = update(ref(db,'/users/' + props.UID ), LevelUPData).then(() => {
        console.log('Updated Database XP Increase')
        return true
      })
      .catch((error) => {
        // The write failed...
        console.log('Error code :',error.code)
        console.log('Error Message :',error.message)
        SetErrorCode(error.message);
        SetErrorMessage(error.message);
        return false
      });

  }

  async function IsLevelDown () {
    console.log('checking leveldown')
    CurrentXP.current=CurrentXP.current-MultiPlier.current

    while (CurrentXP.current <= 0){
      console.log('XP MInus')
      CurrentLevel.current=CurrentLevel.current-1
      console.log('Level :',CurrentLevel.current)
      MaxXP.current=CurrentLevel.current*3
      console.log('MaxXP :',MaxXP.current)
      CurrentXP.current = CurrentXP.current+ MaxXP.current
      console.log('XP :',CurrentXP.current)

      SetErrorCode('Oops your level is reduced');
      SetErrorMessage('Time management is not a easy thing, Keep Fighting :D');
      setShowAlert1(true);
    }

    const LevelUPData ={
      Level : CurrentLevel.current
      ,XP: CurrentXP.current
    }

    const res1 = update(ref(db,'/users/' + props.UID ), LevelUPData).then(() => {
      console.log('Updated Database XP Decrease') 
      return true
    })
    .catch((error) => {
      // The write failed...
      console.log('Error code :',error.code)
      console.log('Error Message :',error.message)
      SetErrorCode(error.message);
      SetErrorMessage(error.message);
      return false
    });
  }
  
  async function GetUSerPersonalData(){
  await  get(child(ref(db), 'users/'+ props.UID)).then((snapshot) => {
      if (snapshot.exists()) {

        CurrentLevel.current=snapshot.val().Level
        CurrentXP.current=snapshot.val().XP
        MaxXP.current= snapshot.val().Level * 10
        StudyCount.current = snapshot.val().TaskStudyDone
        ClassCount.current =snapshot.val().TaskClassDone
        TestCount.current =snapshot.val().TaskTestDone
        HomeworkCount.current =snapshot.val().TaskHomeWorkDone
        TaskCount.current=snapshot.val().TaskDone

        console.log('User level :',CurrentLevel)
        console.log(' Userxp :',CurrentXP)
        console.log(' User Map XP :',MaxXP)
        return true
      } else {
        console.log("No data available");
        return false
      }     
    });
  }

  const GetListData= (ListID2 :String)=> {
    get(child(ref(db), '/Schedule/' + props.UID + '/' + ListID2)).then((snapshot) => {
      if (snapshot.exists()) {
        StudyTag.current=snapshot.val().tags.Study 
        TestTag.current=snapshot.val().tags.Test
        ClassTag.current=snapshot.val().tags.Class
        HomeworkTag.current=snapshot.val().tags.HomeWork
        
        MultiPlier.current= snapshot.val().Difficulty*snapshot.val().Importance
      } else {
        console.log("No data available");
      }
    });
  }

  async function UpdateTaskDone () {

    if(TestTag.current== true) {TestCount.current=TestCount.current+1}
    if(StudyTag.current==true) {StudyCount.current=StudyCount.current+1}
    if(ClassTag.current==true) {ClassCount.current=ClassCount.current+1}
    if(HomeworkTag.current==true) {HomeworkCount.current=HomeworkCount.current+1}
    TaskCount.current=TaskCount.current+1
    
    const AchievementDone ={
      TaskDone :TaskCount.current,
      //TaskDoneQuickly :0,
      TaskStudyDone :StudyCount.current,
      TaskTestDone:TestCount.current,
      TaskClassDone:ClassCount.current,
      TaskHomeWorkDone:HomeworkCount.current
    }

    const res1 = update(ref(db,'/users/' + props.UID ), AchievementDone).then(() => {
      console.log('Updated Database XP Increase')
      return true
    })
    .catch((error) => {
      // The write failed...
      console.log('Error code :',error.code)
      console.log('Error Message :',error.message)
      SetErrorCode(error.message);
      SetErrorMessage(error.message);
      return false
    });
}

  async function TodoSuccess (ListID : String) {

     GetUSerPersonalData()
     GetListData(ListID)

    const postData ={
      StatusBerhasil :true
      ,StatusSelesai :true
    }

    const res1 = update(ref(db,'/Schedule/' + props.UID + '/' + ListID ), postData).then(() => {
      IsLevelUP()
      UpdateTaskDone()
      return true
    })
    .catch((error) => {
      console.log('Error code :',error.code)
      console.log('Error Message :',error.message)
      SetErrorCode(error.message);
      SetErrorMessage(error.message);
      return false
    });
  }

  async function TodoFailed(ListID : String){

    GetUSerPersonalData()
    GetListData(ListID) 
    
    const postData ={
      StatusGagal :true
      ,StatusSelesai :true
    }

    const res1 = await update(ref(db,'/Schedule/' + props.UID + '/' + ListID ), postData).then(() => {
      IsLevelDown()
      return true
    })
    .catch((error) => {
      console.log('Error code :',error.code)
      console.log('Error Message :',error.message)
      SetErrorCode(error.message);
      SetErrorMessage(error.message);
      return false
    });
  }

    const snapshotToArray = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => {   
            console.log('childsnapshot :',childSnapshot.key)
            const item = childSnapshot.val()
            item.key = childSnapshot.key
            if(childSnapshot.val().StatusSelesai==false){
              console.log('childsnapshot True :',childSnapshot.key)
              returnArr.push(item)

            }
        });


        return returnArr;
    }

    const loadData =  () => { 
      getCurrentDate()
      // console.log(StartWeekdate)
      // console.log(EndWeekdate)


      const mostViewedPosts =
      query(ref(db, 'Schedule/'+props.UID)
        ,orderByChild("DueDate") 
        , startAt(StartWeekdate) 
        , endAt(EndWeekdate)
      );

      onValue(mostViewedPosts, (snapshot) => {
          // if(snapshot.exists()){
          //   console.log(snapshot.key,'On Value')
          // }
          // else{
          //   console.log('data empty')
          // }
          setShowLoading(false);
          let data1 = snapshotToArray(snapshot) 
          // console.log(data1)
          if(data1.length!=0){
            setIsEmpty(false)
          }
          else {
            setIsEmpty(true)
          }
          
          setData(data1)
          // console.log('Data :',data)
      });
    }
    useEffect(() => {
        loadData()
      }, [props.UID])

    return(
        <IonList>
          <IonRow>
            <IonCol>
            {IsEmpty && (
                <IonRow>
                  No Data Available
                </IonRow>
              )}
              {data.map((item) => (
                <IonItemSliding>
                  {isPlatform('mobile') && (   
                  <IonItem key={item.key} class='Field3-mobile'>
                    <IonCol size='5'>
                    <IonRow>
                          <h3>{item.TaskName}</h3>
                          </IonRow>
                          <IonRow>
                            Keterangan : {item.Keterangan}
                          </IonRow>
                          <IonRow>
                            DueDate : {formatDate(item.DueDate)}
                          </IonRow>
                    </IonCol>
                    <IonGrid>
                          { item.tags.Class  && (
                              <IonChip>
                                <IonIcon src={schoolSharp}class='TagsIcon-mobile'/>
                                <IonText class='Font'>Class</IonText>
                              </IonChip>

                          )}
                          { item.tags.Study  && (
                              <IonChip>
                                <IonIcon src={bookSharp}class='TagsIcon-mobile'/>
                                <IonText class='Font'>Study</IonText>
                              </IonChip>
                              
                          )}
                          { item.tags.HomeWork && (
                              <IonChip>
                                <IonIcon src={clipboard}class='TagsIcon-mobile'/>
                                <IonText class='Font'>HomeWork</IonText>
                              </IonChip>
                              
                          )}
                          { item.tags.Test  && (
                              <IonChip>
                                <IonIcon src={documentsSharp} class='TagsIcon-mobile'/>
                                <IonText class='Font'>Test</IonText>
                              </IonChip> 
                          )}
                    </IonGrid>
                  </IonItem>
                  )}
                  {isPlatform('desktop') && (
                    <IonItem key={item.key} class='Field3-desktop'>
                    <IonCol size='5'>
                      <IonText >
                          <IonRow>
                            Name : {item.TaskName}
                          </IonRow>
                          <IonRow>
                            Keterangan : {item.Keterangan}
                          </IonRow>
                          <IonRow>
                            DueDate : {formatDate(item.DueDate)}
                          </IonRow>
                        </IonText>
                    </IonCol>
                    <IonGrid>
                          { item.tags.Class  && (
                              <IonChip>
                                <IonIcon src={schoolSharp}class='TagsIcon'/>

                                <IonText class='Font'>Class</IonText>
                              </IonChip>
                          )}
                          { item.tags.Study  && (
                              <IonChip>
                                <IonIcon src={bookSharp}class='TagsIcon'/>
                                <IonText class='Font'>Study</IonText>
                              </IonChip>
                          )}
                          { item.tags.HomeWork && (
                              <IonChip>
                                <IonIcon src={clipboard}class='TagsIcon'/>
                                <IonText class='Font'>HomeWork</IonText>
                              </IonChip>
                          )}
                          { item.tags.Test  && (
                              <IonChip>
                                <IonIcon src={documentsSharp} class='TagsIcon'/>
                                <IonText class='Font'>Test</IonText>
                              </IonChip>
                          )}
                    </IonGrid>
                  </IonItem>
                  )}
                  <IonItemOptions side="start">
                    <IonItemOption color="success" onClick={async () => await TodoSuccess(item.key)}>
                      <IonIcon src={checkmarkCircle}/>
                    </IonItemOption>
                  </IonItemOptions>

                  <IonItemOptions side="end">
                    <IonItemOption color="danger" onClick={async () =>await TodoFailed(item.key)}>
                      <IonIcon src={closeCircle}/>
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
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
};
export default ScheduleList;