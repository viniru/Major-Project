/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.example.mynetwork.Request} Request
 * @transaction
 */

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

async function Request(tn) {           
    //process the request from the victim

    //A list that contains the ids of every resource present in the blockchain network
    const resourceRegistry = await getAssetRegistry("org.example.mynetwork.Resources"); 
    
    let resources = []

    //list of volunteers that are offering the requested type of resource
    let volunteers = []  
    let i;

    //filer unneeded resource from the registry
    for(i=0;i<resourceRegistry.length;i++)          
        if(resourceRegistry[i].equals(tn.resourceType) == true)
        {
            resources.push(resourceRegistry[i]);
            //resource has a relation to its owner in its definition
            volunteers.push(resourceRegistry[i].volunteer_origin);   
        }

    if(volunteers.length == 0)
    {
        console.log("There are no volunteers")
        break;
    }

    //Select one volunteer who has relatively least distance
    //can upgrade by calculating distance using google map api
    let min = Number.MAX_VALUE;
    let distance;
    let minVol = volunteers[0];
    for(i=0;i<volunteers.length;i++)
    {
        let v = volunteers[i];
        let loc = tn.victim.loc;
        distance = getDistanceFromLatLonInKm(loc.latitude,loc.longitue,v.latitude,v.longitude);
        if(distance < min)
        {
            min = distance;
            minVol = v;
        }
    }
    
    //here what we will do is , the volunteer can run a transaction which will notify the victim 
    //that the volunteer has accepted the request.
    //We will not be using notification for the time being , but will implement in  fabric
    //Here, we will just update the volunteer's attribute saying if he has received a request for
    //a particular resource or not.
}
