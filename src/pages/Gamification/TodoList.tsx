import {  IonRow, IonCol,  IonText, IonLoading, IonItemOption, 
    IonItem, IonList, IonItemSliding, IonItemOptions, IonChip, IonAlert, IonGrid} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import {calendar, add, bookSharp, schoolSharp ,documentsSharp , clipboard, checkmarkCircle,closeCircle, watchOutline} from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo, remove, limitToLast} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { isEmpty } from '@firebase/util';


import './TodoList.css'
import { isPlatform } from '@ionic/core';


const TodoList: React.FC<{UID :string}> = (props) => {
    console.log('TodoList,UID :',props.UID)
    const [data, setData] = useState<any[]>([])

    const formatDate = (value: string) => {
      return format(parseISO(value), 'dd MMM yyyy');
    }
    const [IsEmpty,setIsEmpty]=useState(true)

    const [showLoading, setShowLoading] = useState(true);
    const [showAlert1, setShowAlert1] = useState(false);
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')

    const [IsTimerused, SetIsTimerused]=useState(false)

    const CurrentLevel  = useRef<number | any>()
    const CurrentXP  = useRef<number | any>() 
    const CurrMaxXP  = useRef<number | any>()
    const MultiPlier=useRef<number | any>()
    const SummonTicket = useRef<number | any>()

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

    async function IsLevelUP () {
        console.log('checking levelup')
        CurrentXP.current=CurrentXP.current+MultiPlier.current


        while (CurrentXP.current >= CurrMaxXP.current){
          
          SummonTicket.current=SummonTicket.current+1
          console.log('XP OverFlow')
          CurrentLevel.current=CurrentLevel.current+1
          console.log('Level :',CurrentLevel.current)
          CurrentXP.current = CurrentXP.current- CurrMaxXP.current
          console.log('XP :',CurrentXP.current)
          CurrMaxXP.current=CurrentLevel.current*3
          console.log('MaxXP :',CurrMaxXP.current)
        }

        const LevelUPData ={
          Level : CurrentLevel.current,
          XP: CurrentXP.current,
          SummonTicket: SummonTicket.current
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

    function secondsToTime(e: number){
      const h = Math.floor(e / 3600).toString().padStart(2,'0'),
            m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
            s = Math.floor(e % 60).toString().padStart(2,'0');
      
      return h + ':' + m + ':' + s;
      //return `${h}:${m}:${s}`;
  }

    // async function IsLevelDown () {
    //   console.log('checking leveldown')
    //   CurrentXP.current=CurrentXP.current-MultiPlier.current

    //   while (CurrentXP.current <= 0){
    //     console.log('XP MInus')
    //     CurrentLevel.current=CurrentLevel.current-1
    //     console.log('Level :',CurrentLevel.current)
    //     CurrMaxXP.current=CurrentLevel.current*3
    //     console.log('MaxXP :',CurrMaxXP.current)
    //     CurrentXP.current = CurrentXP.current+ CurrMaxXP.current
    //     console.log('XP :',CurrentXP.current)

    //     SetErrorCode('Oops your level is reduced');
    //     SetErrorMessage('Time management is not a easy thing, Keep Fighting :D');
    //     setShowAlert1(true);
    //   }

    //   const LevelUPData ={
    //     Level : CurrentLevel.current
    //     ,XP: CurrentXP.current
    //   }

    //   const res1 = update(ref(db,'/users/' + props.UID ), LevelUPData).then(() => {
    //     console.log('Updated Database XP Decrease') 
    //     return true
    //   })
    //   .catch((error) => {
    //     // The write failed...
    //     console.log('Error code :',error.code)
    //     console.log('Error Message :',error.message)
    //     SetErrorCode(error.message);
    //     SetErrorMessage(error.message);
    //     return false
    //   });
    // }
    async function GetUSerPersonalData(){
    await  get(child(ref(db), 'users/'+ props.UID)).then((snapshot) => {
        if (snapshot.exists()) {

          CurrentLevel.current=snapshot.val().Level
          CurrentXP.current=snapshot.val().XP
          CurrMaxXP.current= snapshot.val().Level * 3
          StudyCount.current = snapshot.val().TaskStudyDone
          ClassCount.current =snapshot.val().TaskClassDone
          TestCount.current =snapshot.val().TaskTestDone
          HomeworkCount.current =snapshot.val().TaskHomeWorkDone
          TaskCount.current=snapshot.val().TaskDone
          SummonTicket.current=snapshot.val().SummonTicket

          console.log('User level :',CurrentLevel)
          console.log(' Userxp :',CurrentXP)
          console.log(' User Map XP :',CurrMaxXP)
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
          // console.log('User Pesonal Data :',snapshot.val());
          // console.log('Diffuculty :',snapshot.val().Difficulty)
          // console.log('Importance :',snapshot.val().Importance)
          // console.log('Study :',snapshot.val().tags.Study )
          // console.log('test :',snapshot.val().tags.Test )
          // console.log('class :',snapshot.val().tags.Class )
          // console.log('homework :',snapshot.val().tags.HomeWork )

          StudyTag.current=snapshot.val().tags.Study 
          TestTag.current=snapshot.val().tags.Test
          ClassTag.current=snapshot.val().tags.Class
          HomeworkTag.current=snapshot.val().tags.HomeWork
          
          MultiPlier.current= 3
        } else {
          console.log("No data available");
        }
      });
    }

  //   async function UpdateTaskDone () {

  //     if(TestTag.current== true) {TestCount.current=TestCount.current+1}
  //     if(StudyTag.current==true) {StudyCount.current=StudyCount.current+1}
  //     if(ClassTag.current==true) {ClassCount.current=ClassCount.current+1}
  //     if(HomeworkTag.current==true) {HomeworkCount.current=HomeworkCount.current+1}
  //     TaskCount.current=TaskCount.current+1
      
  //     const AchievementDone ={
  //       TaskDone :TaskCount.current,
  //       TaskStudyDone :StudyCount.current,
  //       TaskTestDone:TestCount.current,
  //       TaskClassDone:ClassCount.current,
  //       TaskHomeWorkDone:HomeworkCount.current
  //     }

  //     const res1 = update(ref(db,'/users/' + props.UID ), AchievementDone).then(() => {
  //       console.log('Updated Database XP Increase')
  //       return true
  //     })
  //     .catch((error) => {
  //       // The write failed...
  //       console.log('Error code :',error.code)
  //       console.log('Error Message :',error.message)
  //       SetErrorCode(error.message);
  //       SetErrorMessage(error.message);
  //       return false
  //     });
  // }

  async function IstimerInUse (){
    const IsTimerInUse = query(ref(db, '/Schedule/' + props.UID), orderByChild("InUse"), equalTo(true));
    onValue(IsTimerInUse, (snapshot) => {
      let data1 = snapshotToArray(snapshot);
      if (data1.length > 0) {
        console.log('Is In Use? :', data1.length);
        SetErrorCode('Timer Is in Use');
        SetErrorMessage('Timer Is in use , Please Finish Your Task First ');
        //setShowAlert1(true);
        SetIsTimerused(true);
      } else {
        SetIsTimerused(false);
      }
    })

    //return false;
  }

  // function UpdateDatabaseAfteSuccess (ListID : String){
  //   const postData ={
  //     StatusApproved :true,
  //     InUse :true
  //  }

  //  const res1 = update(ref(db,'/Schedule/' + props.UID + '/' + ListID ), postData).then(() => {
  //    //IsLevelUP()
  //    //UpdateTaskDone()
  //    return true
  //  })
  //  .catch((error) => {
  //    console.log('Error code :',error.code)
  //    console.log('Error Message :',error.message)
  //    SetErrorCode(error.message);
  //    SetErrorMessage(error.message);
  //    return false
  //  });
  // }

    async function TodoSuccess (ListID : String) {

      // const IsTimerInUse = query(ref(db, '/Schedule/' + props.UID), orderByChild("InUse"), equalTo(true));
      // onValue(IsTimerInUse, (snapshot) => {
      //   let data1 = snapshotToArray(snapshot);
      //   if (data1.length > 0) {
      //     console.log('Is In Use? :', data1.length);
      //     SetErrorCode('Timer Is in Use');
      //     SetErrorMessage('Timer Is in use , Please Finish Your Task First ');
      //     setShowAlert1(true);
      //   }
      // })


      IstimerInUse()
      console.log("Timer in Use",IsTimerused)
      GetUSerPersonalData()
      GetListData(ListID)

      if(IsTimerused){
        setShowAlert1(true);
      }else{
        const postData ={
            StatusApproved :true,
            InUse :true
        }
  
        const res1 = update(ref(db,'/Schedule/' + props.UID + '/' + ListID ), postData).then(() => {
          //IsLevelUP()
          //UpdateTaskDone()
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

      


      // const postData ={
      //     StatusApproved :true,
      //     InUse :true
      //  }
 
      //  const res1 = update(ref(db,'/Schedule/' + props.UID + '/' + ListID ), postData).then(() => {
      //    //IsLevelUP()
      //    //UpdateTaskDone()
      //    return true
      //  })
      //  .catch((error) => {
      //    console.log('Error code :',error.code)
      //    console.log('Error Message :',error.message)
      //    SetErrorCode(error.message);
      //    SetErrorMessage(error.message);
      //    return false
      //  });
    }

    async function Delete(ListID : String){
      GetUSerPersonalData()
      GetListData(ListID) 

      remove(ref(db,'/Schedule/' + props.UID + '/' + ListID ))
    }

    /*async function TodoFailed(ListID : String){

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
    }*/

    const snapshotToArray = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => {     
          const item = childSnapshot.val()
          item.key = childSnapshot.key
          returnArr.push(item)
        });
        return returnArr;
    }

    const loadData = () => { 

      IstimerInUse()

      const mostViewedPosts =query(ref(db, 'Schedule/'+props.UID),orderByChild("StatusApproved") , equalTo(false) );
      onValue(mostViewedPosts, (snapshot) => {
          if(snapshot.exists()){
            setIsEmpty(false)
          }else
          {
            setIsEmpty(true)
          }
          let data1 = snapshotToArray(snapshot) 
          console.log('DATA :',data1)
          setData(data1)
          setShowLoading(false);
          
      });
    }
    useEffect(() => {
        loadData()
      }, [props.UID])

    return(
        <IonList class='blurred-box'>
          <IonRow>
            <IonCol>
              {IsEmpty && (
                <IonRow>
                  No Data Available
                </IonRow>
              )}
              <IonGrid>
                
              {data.map((item) => (
                <IonItemSliding class='IonItemRoundedDoang'>
                  {isPlatform('mobile') && (                  
                  <IonItem key={item.key} class='Field3-mobile'>
                      <IonCol size='5'  >
                        
                          <IonRow>
                          <h3>{item.TaskName}</h3>
                          </IonRow>
                          <IonRow>
                            <IonText class='Font'>{item.Keterangan}</IonText>
                          </IonRow>
                          <IonRow>
                            <IonText class='Font'>Time To Complete : {secondsToTime(item.Timer)}</IonText>
                          </IonRow>
                          {/* <IonRow>
                            DueDate : {formatDate(item.DueDate)}
                          </IonRow> */}

                      </IonCol>
                      <IonGrid >
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
                    </IonItem>)}
                  
                  
                    {isPlatform('desktop') && (
                    <IonItem key={item.key} class='Field3-desktop'>
                      <IonCol size='5'  >
                        <IonText >
                          <IonRow>
                            <IonText> Name : {item.TaskName} </IonText> 
                          </IonRow>
                          <IonRow>
                            Keterangan : {item.Keterangan}
                          </IonRow>
                          <IonRow>
                            Time To Complete : {secondsToTime(item.Timer)}
                          </IonRow>
                          {/* <IonRow>
                            DueDate : {formatDate(item.DueDate)}
                          </IonRow> */}
                        </IonText>
                      </IonCol>
                      <IonGrid >
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
                    </IonItem>)}

                  <IonItemOptions side="start" class='IonItemRoundedDoang'>
                    <IonItemOption color="success" onClick={async () => await TodoSuccess(item.key)}>
                      <IonIcon src={checkmarkCircle}/>
                      <IonText>Start</IonText>
                    </IonItemOption>
                  </IonItemOptions>

                  <IonItemOptions side="end" class='IonItemRoundedDoang'>
                    <IonItemOption color="danger" onClick={async () =>await Delete(item.key)}>
                      <IonIcon src={closeCircle}/>
                      <IonText>Delete</IonText>
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
              </IonGrid>
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
export default TodoList;