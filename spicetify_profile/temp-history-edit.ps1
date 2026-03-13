$path = "C:\Users\48796\AppData\Roaming\spicetify\CustomApps\spicetify-history\index.js"
$backup = "$path.bak4"
Copy-Item -Path $path -Destination $backup -Force
$content = Get-Content -Path $path -Raw

$old1 = 'b.default.createElement("div",{className:"songActions"},b.default.createElement("button",{onClick:()=>o(t.uid)},"X"))'
$new1 = 'b.default.createElement("div",{className:"songActions"},b.default.createElement("button",{className:"historyAddPlaylistButton",title:"Add to playlist",onClick:()=>historyQuickAdd(t.uri),onContextMenu:e=>{e.preventDefault(),historyShowPlaylistPicker(t.uri)}},"+"),b.default.createElement("button",{onClick:()=>o(t.uid),title:"Delete"},"X"))'

$old2 = '")},100)}var F="historyAppOptions",'
$helpers = @'
var historyLastPlaylistKey="historyLastPlaylistUri",historyGetLastPlaylist=()=>{try{return Spicetify.Platform?.LocalStorageAPI?.getItem(historyLastPlaylistKey)||localStorage.getItem(historyLastPlaylistKey)||""}catch(e){return""}},historySetLastPlaylist=e=>{try{Spicetify.Platform?.LocalStorageAPI?.setItem(historyLastPlaylistKey,e)}catch(e){}try{localStorage.setItem(historyLastPlaylistKey,e)}catch(e){}},historyGetPlaylists=async()=>{if(!Spicetify.Platform?.RootlistAPI)return[];var e=await Spicetify.Platform.RootlistAPI.getContents(),t=[];return await(async function n(e){for(let a of e||[])if("playlist"===a.type){(a.isCollaborative||a.isOwnedBySelf||a.canAdd)&&t.push({uri:a.uri,name:a.name||""})}else"folder"===a.type&&await n(a.items||[])})(e.items||[]),t},historyAddToPlaylist=async(e,t,a)=>{if(!t)return;try{await Spicetify.Platform.PlaylistAPI.add(t,[e],{before:"end"}),historySetLastPlaylist(t),Spicetify.showNotification("Added to "+(a||"playlist"))}catch(e){console.error("Failed to add to playlist",e),Spicetify.showNotification("Failed to add to playlist",!0)}},historyShowPlaylistPicker=async e=>{var t=await historyGetPlaylists();if(0===t.length)return void Spicetify.showNotification("No playlists available",!0);var a=historyGetLastPlaylist(),n=t.map(e=>'<button class="historyAddPlaylistItem" data-uri="'+e.uri+'" data-name="'+(e.name||"").replace(/"/g,"&quot;")+'">'+(e.name||"(untitled)")+"</button>").join("");Spicetify.PopupModal.display({title:"Add to playlist",content:'<div class="historyAddPlaylistList">'+n+"</div>"}),setTimeout(()=>{document.querySelectorAll(".historyAddPlaylistItem").forEach(t=>{t.addEventListener("click",async()=>{var n=t.getAttribute("data-uri"),i=t.getAttribute("data-name")||"";n&&(await historyAddToPlaylist(e,n,i),Spicetify.PopupModal.hide())})});if(a){var t=document.querySelector('.historyAddPlaylistItem[data-uri="'+a+'"]');t&&t.classList.add("is-recent")}},100)},historyQuickAdd=async e=>{var t=historyGetLastPlaylist();if(t){var a=(await historyGetPlaylists()).find(e=>e.uri===t);return void await historyAddToPlaylist(e,t,a?.name)}return historyShowPlaylistPicker(e)};
'@
$new2 = '")},100)}' + $helpers + 'var F="historyAppOptions",'

$content = $content.Replace($old1, $new1)
$content = $content.Replace($old2, $new2)

Set-Content -Path $path -Value $content -NoNewline
Write-Output "updated"
