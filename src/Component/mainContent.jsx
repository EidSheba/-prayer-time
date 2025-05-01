import React from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './prayer';
import { useState,useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from "moment"
import 'moment/dist/locale/ar-kw';


moment.locale("ar")
export default function MainContent() {
  // STATES 
  const [remainingTime, setRemainingTime] = useState("");
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

    // make timings in state to change in ui 
  const [timings, setTimings] = useState({
            Fajr: "04:45",
            Dhuhr: "12:58",
            Asr: "16:35",
            Maghrib: "19:36",
            Isha: "21:01", 
  })
 
  // start array of cities

  const cities=[
    {
    name : "طنطا",
    apiName: "Tanta"
  },
             {
    name : "باريس",
    apiName: "Paris"
    },
                     {
    name : "الرياض",
    apiName: "Riyadh"
    },
    
  ]
  const countries = [{
    countryName: "مصر",
    countryApiName:"Egypt"

  },
    {
    countryName: "فرنسا",
    countryApiName:"France"
    },
     {
    countryName: "السعودية",
    countryApiName:"Saudi Arabia"
    }
  ]
  const prayersArray = [
		{ key: "Fajr", displayName: "الفجر" },
		{ key: "Dhuhr", displayName: "الظهر" },
		{ key: "Asr", displayName: "العصر" },
		{ key: "Sunset", displayName: "المغرب" },
		{ key: "Isha", displayName: "العشاء" },
	];
//  city state 
  const [city, setCity] = useState({
    name: "طنطا",
    apiName:"Tanta"
  })
  // country state 
  const [country, setCountry] = useState({
    countryName: "مصر",
    countryApiName:"Egypt"
  })

  // time state /
  const [today, setToday] = useState("")
  
  
  
  async function getPrayerTimes() {
    try {
      const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
        params: {
        
        city: `${city.apiName}`,
        country: `${country.apiName}`,
        method: 5
      }
      });
      

   
// set object timings in set state     
    setTimings(response.data.data.timings)
    
  } catch (error) {
    console.error('Error fetching prayer times:', error);
  }
  }
  useEffect(() => {
    getPrayerTimes()
  }, [city])
  useEffect(() => {
    getPrayerTimes()
  },[country])
   
  useEffect(() => {
    const t = moment()
    setToday(t.format("MMM Do YYYY | h:mm"))
    let interval = setInterval(() => {
      setDownCounter()
    }, 1000);
    return () => {
      clearInterval(interval)
    }
  },[timings])

  const handleChange = (event) => {
   
    const cityObject = cities.find((city) => {
      return city.apiName == event.target.value
      
    })
    setCity(cityObject)
 
  };
  const handleCountry = (event) => {
    const countryObject = countries.find((country) => {
      if (event.target.value == "France") {
          document.body.style.backgroundImage = "url('../../images/parto-1502602898657-3e91760cbb34.jfif')"; 
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
         
      }
      else if(event.target.value == "Egypt") {
          document.body.style.backgroundImage = "url('../../images/alex-azabache-MoonoldXeqs-unsplash.jpg')"; 
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
      }
      else {
           document.body.style.backgroundImage = "url('../../images/illuminated-minare-symbolizes-spirituality-famous-blue-mosque-generated-by-ai_188544-35440.avif')"; 
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
      }
        
      return event.target.value == country.countryApiName
    })
    setCountry(countryObject)
  }
  const setDownCounter=() => {
		const momentNow = moment();

		let prayerIndex = 2;

		if (
			momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1;
		} else if (
			momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
		) {
			prayerIndex = 2;
		} else if (
			momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
		) {
			prayerIndex = 3;
		} else if (
			momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
		) {
			prayerIndex = 4;
		} else {
			prayerIndex = 0;
		}

		setNextPrayerIndex(prayerIndex);

		// now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
		const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}

		const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);

  }

    return (
        <>
            {/* top row  */}
    <Grid
      container
      style={{
        width: '100%',
        color: 'white',
      }}
    >
      <Grid
        item 
        xs={5}
        style={{
          width:"50%",
          color:"black",
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div>
              <h2>{today} </h2>
            
              <h1 style={{ margin: "0" }}>{ country.countryName}</h1>
              <h2 style={{fontSize:"35px",margin:"5px 0"}}> {city.name}</h2>
             
        </div>
      </Grid>

      <Grid
        item 
        xs={5}
        style={{
          width:"50%",
          padding: '20px',
            textAlign: 'center',
          color:"black",
        }}
      >
        <div>
              <h2 >الوقت المتبقي حتي صلاه { prayersArray[nextPrayerIndex].displayName}</h2>
              <h1>{ remainingTime}</h1>
        </div>
      </Grid>
            </Grid>
            {/*end  top row  */}
        <Divider />
        
            {/* prayer cards */}
               <Stack direction="row" spacing={2} style={{marginTop:"30px"}}>
          <div style={{ width: "calc(98%/5)",marginLeft:"10px" }}>
            <Prayer
              title="الفجر"
              myImage="../../images/tower-with-cloud-background_1122-883.avif"
              time={timings.Fajr}

            />
          </div>
        <div style={{width:"calc(98%/5)"}}>
            <Prayer
              title="الظهر"
              myImage="../../images/muslim-mosque-desert_1385-745.avif"
              time={timings.Dhuhr}
              

            />
          </div>
        <div style={{width:"calc(98%/5)"}}>
            <Prayer
              title="العصر"
              myImage="../../images/muslim-praying-sujud-posture_53876-25222.avif"
              time={timings.Asr}
              

            />
          </div>
        <div style={{width:"calc(98%/5)"}}>
            <Prayer
              title="المغرب" 
              myImage="../../images/people-celebrating-ramadan-together_23-2151404357.avif"
              time={timings.Maghrib}

            />
          </div>
        <div style={{width:"calc(98%/5)"}}>
            <Prayer
              title="العشاء" 
              myImage="../../images/preparation-ramadan-tradition_23-2151925239.avif"
              time={timings.Isha}
            />
          </div>      
            </Stack>
            {/* end prayer cards */}

        {/* start select box  */}
        <Stack style={{
          width: "20%",
          margin:"40px auto"
        }}>
          
          <FormControl fullWidth style={{background:"#0288D1"}} >
        <InputLabel id="demo-simple-select-label" >المدينه</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={age}
          label="المدينه"
          onChange={handleChange}
        >
              {cities.map((city) => {

                return (
                  <MenuItem value={city.apiName} key={city.apiName}>
                    {city.name}
                  </MenuItem>
               )
              })}
       
        </Select>
      </FormControl>
        </Stack>
        {/* end select box  */}
        
        {/* start select box  */}
        <Stack style={{
          width: "20%",
          margin:"40px auto"
        }}>
          
          <FormControl fullWidth style={{background:"#0288D1"}} >
        <InputLabel id="demo-simple-select-label">الدوله</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={age}
          label="الدوله"
          onChange={handleCountry}
        >
              {countries.map((country) => {

                return (
                  <MenuItem value={country.countryApiName} key={country.countryApiName}>
                    {country.countryName}
                  </MenuItem>
               )
              })}
       
        </Select>
      </FormControl>
        </Stack>

   
        </>
        
  );
}
