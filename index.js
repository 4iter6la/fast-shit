module.exports = function FastCW(dispatch) {
    
    const blacklist = [8000, 8001, 8002, 8005, 8018, 8025, 8023];

    const fastDungeons = [9077, 9713, 9031, 9032, 9916];

    let zone, loot, dungeon;

    dispatch.hook('S_LOAD_TOPO', 1, event => {
        zone = event.zone;
        loot = {};
        dungeon = [];

        dispatch.toServer('C_DUNGEON_COOL_TIME_LIST', 1, {});
    });

    dispatch.hook('S_DUNGEON_COOL_TIME_LIST', 1, event => {
        dungeon = event.dungeons;
    });

    dispatch.hook('S_SPAWN_ME', 1, event => {
        
        switch(zone) {
            case 9777: // CHANNELWORKS
                event.x = -112670;
                event.y = -33091;
                event.z = 461;
                return true;
            case 9713: // GHILLIEGLADE
                event.x = 52233;
                event.y = 117319;
                event.z = 4382;
                return true;
            case 9031: // ACE AKASHA
                event.x = 72383;
                event.y = 133428;
                event.y = -511;
                return true;
            case 9032: // ACE BARACOS
                event.x = 28214;
                event.y = 178550;
                event.z = -1675;
                return true;
            case 9916: // SCEM
                event.x = 49503;
                event.y = 128043;
                event.z = 3613;
                return true;
            default: return;
        }

    });

    dispatch.hook('S_SPAWN_DROPITEM', 1, event => {
        if(!(blacklist.indexOf(event.item) > -1)) loot[event.id.toString()] = 1;
    });

    dispatch.hook('S_DESPAWN_DROPITEM', 1, event => {
        if(event.id.toString() in loot) delete loot[event.id.toString()];
        if(Object.keys(loot).length < 1 && zone > 9000) resetInstance();
    });
	
	dispatch.hook('S_SYSTEM_MESSAGE', 1, event =>{
		if(event.message.includes("@1193")){
			setTimeout(function(){
			dispatch.toServer(Buffer.from("14005FFF7C230000004C3BC600CDAB470080E6C3", "hex"));},100000)
		}
	});
	
    function resetInstance() {

        if((zone > 9033 || zone < 9031) && fastDungeons.indexOf(zone) > -1)  dispatch.toServer('C_RESET_ALL_DUNGEON', 1, null);
        
        else {
            for (let dung in dungeon) {
                if(dungeon[dung].id === 9031 || dungeon[dung].id === 9032)
                    if(dungeon[dung].entry > 0) swapAce();
            }
        }
       
    }

    function swapAce() {
        switch(zone) {
            case 9031:
                dispatch.toServer('C_DUNGEON_WORK_ENTER', 1,{
                    count: 2,
                    unk1: 13,
                    zone: 9032,
                    random: 0,
                    unk2: 13,
                    unk3: 21,
                    challenge1: 1,
                    unk4: 21,
                    challenge2: 2
                });
            case 9032:
                dispatch.toServer('C_DUNGEON_WORK_ENTER', 1,{
                    count: 2,
                    unk1: 13,
                    zone: 9031,
                    random: 0,
                    unk2: 13,
                    unk3: 21,
                    challenge1: 1,
                    unk4: 21,
                    challenge2: 2
                });
            default: break;
        }
    }

}
