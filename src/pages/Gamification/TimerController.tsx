import { IonContent, IonHeader, IonPage, IonRow, IonCol, IonImg, IonText, IonLabel,IonLoading, IonItemOption, IonRange
    ,IonItem, IonList, IonItemSliding, IonItemOptions, IonChip, IonAlert, IonGrid, isPlatform, IonButton} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import {calendar, add, bookSharp, schoolSharp ,documentsSharp , clipboard, checkmarkCircle,closeCircle, watchOutline, timer} from "ionicons/icons";
import React, { useState, useRef, useEffect ,SetStateAction} from 'react';
import { format, parseISO,startOfWeek ,endOfWeek,startOfDay, getDate } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo, startAt, endAt, onChildAdded, onChildRemoved, onChildChanged, limitToFirst, limitToLast} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getPlatforms } from '@ionic/core';
import { time } from 'console';

import './Timer.css'

const TimerController: React.FC<{UID :string}> = (props) => {
    // console.log('TodoList,UID :',props.UID)
    const [data, setData] = useState<any[]>([])

    const [IsEmpty,setIsEmpty]=useState(true)

    const [showLoading, setShowLoading] = useState(true);
    const [showAlert1, setShowAlert1] = useState(false);
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')
    const [TimerOn,SetTimerOn]=useState(false)
    const [TimerPenaltyOn,SetTimerPenaltyOn]=useState(false)
    const [Time,SetTime]=useState(0) 
    const [TimeToPenalty,SetTimeToPenalty]=useState(0) 
    
    const SummonTicket = useRef<number | any>()

    const OrgTime = useRef<number>(0)  
    const Timeleft = useRef<number>(0)
    const TimePenaltyleft = useRef<number>(0)
    const CurrentLevel  = useRef<number | any>()
    const CurrentXP  = useRef<number | any>() 
    const MaxXP  = useRef<number | any>()
    const MultiPlier=useRef<number | any>()
    const Difficulty=useRef<number | any>()

    const TaskCount=useRef<number | any>()
    const StudyCount=useRef<number | any>()
    const ClassCount=useRef<number | any>()
    const TestCount=useRef<number | any>()
    const HomeworkCount=useRef<number | any>()
    const EasyCount=useRef<number | any>()
    const MedCount=useRef<number | any>()
    const HardCount=useRef<number | any>()
    const VHardCount=useRef<number | any>()
 

    const StudyTag=useRef<Boolean>()
    const ClassTag=useRef<Boolean>()
    const TestTag=useRef<Boolean>()
    const HomeworkTag=useRef<Boolean>()

    const db = getDatabase();


    function secondsToTime(e: number){
      const h = Math.floor(e / 3600).toString().padStart(2,'0'),
            m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
            s = Math.floor(e % 60).toString().padStart(2,'0');
      
      return h + ':' + m + ':' + s;
      //return `${h}:${m}:${s}`;
  }

    async function IsLevelUP () {
      console.log('checking levelup')
      CurrentXP.current=CurrentXP.current+MultiPlier.current // Tambah XP
      console.log('Current XP After LvlIng',CurrentXP.current)

      SummonTicket.current=SummonTicket.current+1
      while (CurrentXP.current >= MaxXP.current){
        console.log('XP OverFlow') //naikin Level
        CurrentLevel.current=CurrentLevel.current+1
        console.log('Level :',CurrentLevel.current) 
        CurrentXP.current = CurrentXP.current- MaxXP.current //Turunin XP
        console.log('XP :',CurrentXP.current)
        MaxXP.current=CurrentLevel.current*3 //Update Max XP
        console.log('MaxXP :',MaxXP.current)
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

  async function GetUSerPersonalData(){
  await  get(child(ref(db), 'users/'+ props.UID)).then((snapshot) => {
      if (snapshot.exists()) {

        CurrentLevel.current=snapshot.val().Level
        CurrentXP.current=snapshot.val().XP
        MaxXP.current= snapshot.val().Level * 3
        StudyCount.current = snapshot.val().TaskStudyDone
        ClassCount.current =snapshot.val().TaskClassDone
        TestCount.current =snapshot.val().TaskTestDone
        HomeworkCount.current =snapshot.val().TaskHomeWorkDone
        TaskCount.current=snapshot.val().TaskDone
        SummonTicket.current=snapshot.val().SummonTicket
        EasyCount.current=snapshot.val().EasyTaskDone
        MedCount.current=snapshot.val().MedTaskDone
        HardCount.current=snapshot.val().HardTaskDone
        VHardCount.current=snapshot.val().VHardTaskDone

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
        MultiPlier.current= snapshot.val().Difficulty *3
        Difficulty.current=snapshot.val().Difficulty
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
    if(Difficulty.current==1) {EasyCount.current=EasyCount.current+1}
    if(Difficulty.current==2) {MedCount.current=MedCount.current+1}
    if(Difficulty.current==3) {HardCount.current=HardCount.current+1}
    if(Difficulty.current==4) {VHardCount.current=VHardCount.current+1}
    

    const AchievementDone ={
      TaskDone :TaskCount.current,
      //TaskDoneQuickly :0,
      TaskStudyDone :StudyCount.current,
      TaskTestDone:TestCount.current,
      TaskClassDone:ClassCount.current,
      TaskHomeWorkDone:HomeworkCount.current,
      EasyTaskDone:EasyCount.current,
      MedTaskDone:MedCount.current,
      HardTaskDone:HardCount.current,
      VHardTaskDone:VHardCount.current,

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

async function StartTimer (ListID : String){

  SetTimerOn(true)

  const postData ={
    DateMulai : Date().toLocaleString(),
    StatusMulai :true
  }

  console.log(new Date(postData.DateMulai).toISOString())

  const res1 = update(ref(db,'/Schedule/' + props.UID + '/' + ListID ), postData).then(() => {
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

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 0.5;
const ALERT_THRESHOLD = 0.25;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

//console.log(COLOR_CODES.info.color);

function setRemainingPathColor(TimePercentDone :number) {
  const { alert, warning, info } = COLOR_CODES;

  const doc = document.getElementById("base-timer-path-remaining")
  if(doc !== null){
    doc.style.setProperty('color' ,info.color)
  }

  if (TimePercentDone <= alert.threshold) {
    const doc = document.getElementById("base-timer-path-remaining")
    if(doc !== null){
      doc.style.removeProperty(warning.color)
      doc.style.setProperty('color' ,alert.color)
    }

  } else if (TimePercentDone <= warning.threshold) {

    const doc = document.getElementById("base-timer-path-remaining")
    if(doc !== null){
      doc.style.removeProperty(info.color)
      doc.style.setProperty('color' ,warning.color)
    }
  }
}

function calculateTimeFraction() {
  if(Timeleft.current != null){
    
    //console.log(Time / Timeleft.current);
    return ( Timeleft.current  / OrgTime.current);
  }else{
    return Time
  }
}
    
// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;

    const box=document
    .getElementById("base-timer-path-remaining")
    
    if (box != null) {
        box.style.setProperty("stroke-dasharray", circleDasharray)

        //console.log('stroke dash array % :',box.style.strokeDasharray);
    }

    setRemainingPathColor(calculateTimeFraction())
    // const ColorCoded=document
    // .getElementById("base-timer__path-remaining")

    // if (ColorCoded != null) {
    //   ColorCoded.style.setProperty("stroke", remainingPathColor)

    //   console.log('stoke :',ColorCoded.style.stroke);
    // }
}

async function ReduceTime(time: number) {
    //console.log('Current Time : ',Time)
      time=time-1;
      if(!(time<0)){
        SetTime(time)
      }
      else{
        SetTime(0)
      }
    setCircleDasharray()
}

async function ReducePenaltyTime(time: number) {
  console.log('Current Penalty Time : ',time)
  time=time-1;
  if(!(time<0)){
    SetTimeToPenalty(time)
  }
  else{
    SetTimeToPenalty(0)
  }
}

async function TodoSuccess (ListID : String) {

    GetUSerPersonalData()
    GetListData(ListID)

    const postData ={
      StatusBerhasil :true,
      StatusSelesai :true,
      InUse : false,
      DateSelesai : format(new Date(),'yyy-MM-dd HH:mm:ss'),
      DateBerhasil : format(new Date(),'yyy-MM-dd HH:mm:ss')
    }

  // const postData ={
  //   StatusBerhasil :true
  //   ,StatusSelesai :true
  //   ,InUse : false
  // }

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

  // const res1 = update(ref(db,'/Schedule/' + props.UID + '/' + ListID ), postData).then(() => {
  //   IsLevelUP()
  //   UpdateTaskDone()
  //   return true
  // })
  // .catch((error) => {
  //   console.log('Error code :',error.code)
  //   console.log('Error Message :',error.message)
  //   SetErrorCode(error.message);
  //   SetErrorMessage(error.message);
  //   return false
  // });
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

async function IsLevelDown () {
  console.log('checking leveldown')
  CurrentXP.current=CurrentXP.current-MultiPlier.current
  console.log('Current XP After DeLvling',CurrentXP.current)

  while (CurrentXP.current <= 0 && CurrentLevel.current>1){
    
    // if(CurrentLevel.current>1){
      console.log('XP MInus')
      CurrentLevel.current=CurrentLevel.current-1
      console.log('Level :',CurrentLevel.current)
    // }

    
    MaxXP.current=CurrentLevel.current*3
    console.log('MaxXP :',MaxXP.current)
    CurrentXP.current = CurrentXP.current+ MaxXP.current
    console.log('XP :',CurrentXP.current)

    if(CurrentLevel.current<=1 && CurrentXP.current<=0)
    {
      CurrentXP.current =0
    }

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

async function TodoFailed(ListID : String){

  GetUSerPersonalData()
  GetListData(ListID) 
  
  const postData ={
    StatusGagal :true
    ,StatusSelesai :true
    ,InUse : false
    ,DateSelesai : format(new Date(),'yyy-MM-dd HH:mm:ss')
    ,DateGagal : format(new Date(),'yyy-MM-dd HH:mm:ss')
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


const loadData =  () => { 

  const mostViewedPosts =query(ref(db, 'Schedule/'+props.UID),orderByChild("InUse") , equalTo(true),limitToLast(1)	);

  onValue(mostViewedPosts, (snapshot) => {
    setShowLoading(false);
    let data1 = snapshotToArray(snapshot) 

      console.log(data1)

    if(data1.length!=0){
      setIsEmpty(false)
    }
    else {
      setIsEmpty(true)
    }
    
    setData(data1)
    

    snapshot.forEach((childsnapshot)=>{

      var startDate =new Date( childsnapshot.val().DateMulai);

      var NowTime = new Date() 

      // if(childsnapshot.val().DateMulai != null){
      //   var  secs = (NowTime.getTime()-startDate.getTime())/1000;
      // }else{
      //   var  secs = childsnapshot.val().Timer
      // }
       
      var secs = childsnapshot.val().DateMulai != null ? (NowTime.getTime()-startDate.getTime())/1000 :childsnapshot.val().Timer
      // } 

      console.log("Seconds:", secs);

      TimePenaltyleft.current=childsnapshot.val().Timer+300-secs
      console.log('Penalty Time Left :', TimePenaltyleft)
      if(TimePenaltyleft.current<0) TimePenaltyleft.current=0
      SetTimeToPenalty(TimePenaltyleft.current)

      console.log(childsnapshot.val().StatusMulai)

      if(childsnapshot.val().StatusMulai ){
        Timeleft.current=childsnapshot.val().Timer - secs;
        OrgTime.current=childsnapshot.val().Timer
        if(Timeleft.current<0) Timeleft.current=0;
        SetTime(Timeleft.current);
        

        setCircleDasharray()
      }else{
        SetTime(secs)
        setCircleDasharray()
      }


      SetTimerOn(childsnapshot.val().StatusMulai)
      if(TimePenaltyleft.current!=0 && TimerOn) SetTimerPenaltyOn(true)

      //SetTime(childsnapshot.val().Timer)
      //console.log("Timer  Get Data: ",childsnapshot.val().Timer)
    })

  });
}
useEffect(() => {
    loadData()
}, [props.UID])

useEffect(() => {
  //console.log('Enterign Use Effect')
  if(Time<=0){
    SetTimerOn(false);
  }
  else{
    setTimeout(()=>{
      //console.log('Reducing Time')
      if(TimerOn){
        ReduceTime(Time);
      }
    }, 1000)
  }

  if(TimeToPenalty<=0){
    SetTimerPenaltyOn(false);
  }else{
    setTimeout(()=>{
      //console.log('Reducing Time')
      if(TimerPenaltyOn){
        ReducePenaltyTime(TimeToPenalty);
      }
    }, 1000)
  }

})
  
  return(
    <IonGrid>
      {IsEmpty && (
    <IonRow class='ion-justify-content-center'>
      No To-do List Started yet
    </IonRow>
          )}
      {data.map((item) => (
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonRow class='ion-justify-content-center'>
                  {item.TaskName}
              </IonRow>
              <IonRow class='ion-justify-content-center'>
                  {item.Keterangan}
              </IonRow>

            </IonCol>
          </IonRow>
          <IonRow class='ion-justify-content-center'>

          <div className="base-timer">
            <svg className='base-timer__svg' viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <g className="base-timer__circle">
                <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45" />

                <path
                  id="base-timer-path-remaining"
                  stroke-dasharray="283"
                  className="base-timer__path-remaining"
                  d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                  "
                ></path>
              </g>
            </svg>
            <span id="base-timer-label" className="base-timer__label">
              { secondsToTime(Time)} 
            </span>
          </div>
          

            {/* <IonCol> */}
              {/* {Time} */}
                
            {/* </IonCol> */}
          </IonRow>
          {Time==0 && TimeToPenalty!=0 &&
            <IonRow class='ion-justify-content-center'>
                Cepat Tekan Tombol Sukses ! To do List ini akan gagal dalam {secondsToTime(TimeToPenalty)}
            </IonRow>
          }

          {TimeToPenalty==0 &&
            <IonRow class='ion-justify-content-center'>
                Oops Waktu Habis , Silahkan Coba Lagi 
            </IonRow>
          }
          <IonRow>
            <IonCol>
              <IonRow class='ion-justify-content-center'>
                <IonButton disabled={item.DateMulai != null} onClick={async () => StartTimer(item.key)}>Start Timer </IonButton>
              </IonRow>
              
              {/* Button Start  */}
            </IonCol>
            {/* <IonCol>
              <IonRow class='ion-justify-content-center'>
                <IonButton onClick={async () =>SetTimerOn(false)}>Stop Timer </IonButton>
              </IonRow>
              //Button Stop 
            </IonCol> */}
            <IonCol>
              {TimeToPenalty==0 &&
              <IonRow class='ion-justify-content-center'>
                  <IonButton disabled={Time!=0} onClick={async () =>await TodoFailed(item.key)}>Failed </IonButton>
              </IonRow>
              }

              {TimeToPenalty!=0 &&
              <IonRow class='ion-justify-content-center'>
                  <IonButton disabled={Time!=0} onClick={async () =>await TodoSuccess(item.key)}>Success </IonButton>
              </IonRow>
              }
              {/* Button Success */}
            </IonCol>
          </IonRow>
          {/* <IonRow>
            <IonCol>
              <IonRow class='ion-justify-content-center'>
                  <IonButton  onClick={async () =>await TodoFailed(item.key)}>Failed </IonButton>
              </IonRow>
            </IonCol>
            <IonCol>
              <IonRow class='ion-justify-content-center'>
                  <IonButton  onClick={async () =>await TodoSuccess(item.key)}>Success </IonButton>
              </IonRow>

            </IonCol>
          </IonRow> */}
        </IonGrid>
      ))}
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Loading...'}
       />
    </IonGrid>

  )
};
export default TimerController;