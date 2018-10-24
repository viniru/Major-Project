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

    
}
