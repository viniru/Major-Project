'use strict';

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
  }
  
    function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

/**
 * Sample transaction
 * @param {org.example.mynetwork.Request} Request
 * @transaction
 */
async function Request(tn) {           
    //process the request from the victim
    //as of now, only processes singly request, will make it work for multiple requests

    //Get the registry of resources of the requested resource type
    const resourceRegistry = await getAssetRegistry("org.example.mynetwork."+tn.resourceType); 
    let resources = [];
    //get the list of all such resources
    let resourceList = await resourceRegistry.getAll();

    let i = 0;
    for(i=0;i<resourceList.length;i++)
    {
        if(resourceList[i].status != "available")
            continue;
        resources.push(resourceList[i]);
    }

    if(resources.length == 0)
    {
        console.log('There are no available resources')
        throw new error('no resources');
    }

    //Select one volunteer who has relatively least distance
    //can upgrade by calculating distance using google map api
    let min = Number.MAX_VALUE;
    let res = resources[0];
    let loc = tn.victim.loc;
    for(i=0;i<resources.length;i++)
    {
        let r = resources[i];
        let distance = getDistanceFromLatLonInKm(loc.latitude,loc.longitue,r.latitude,r.longitude);
        if(distance < min)
        {
            min = distance;
            res = r;
        }
    }
    
    /*here what we will do is , the volunteer can run a transaction which will notify the victim 
        that the volunteer has accepted the request.
      We will not be using notification for the time being , but will implement in  fabric.
      Here, we will just update the volunteer's attribute saying whether or not he has received 
        a request for a particular resource or not
    */

  //update the registries 
  res.status = "requested";   
  tn.victim.resource_requested = []
  tn.victim.resource_requested.push(res);
  const victimRegistry = await getParticipantRegistry("org.example.empty.Victim");
  await victimRegistry.update(tn.victim);
  await resourceRegistry.update(res);
    
}


