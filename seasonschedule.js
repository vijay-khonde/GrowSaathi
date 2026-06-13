function generateSchedule() {
  const region = document.getElementById("region").value;
  const season = document.getElementById("season").value;
  const tbody = document.getElementById("scheduleTable").querySelector("tbody");
  tbody.innerHTML = "";

  if(!region || !season){
    alert("Please select both Region and Season!");
    return;
  }

  // Full smart crop planner data
  const schedules = {
    north: {
      kharif: [
        {crop:"Paddy", variety:"IR-64", sow:"June", harvest:"Sept", spacing:"20x20 cm", fertilizer:"NPK 120:60:40 kg/ha", irrigation:"Flood 3-4 times", rotation:"Rotate with legumes to enrich soil"},
        {crop:"Maize", variety:"HQPM-1", sow:"July", harvest:"Oct", spacing:"60x20 cm", fertilizer:"NPK 150:75:50 kg/ha", irrigation:"Weekly irrigation", rotation:"Intercrop with beans"},
        {crop:"Moong", variety:"ML-131", sow:"July", harvest:"Oct", spacing:"30x10 cm", fertilizer:"Rhizobium culture", irrigation:"Light irrigation weekly", rotation:"Avoid waterlogging"}
      ],
      rabi: [
        {crop:"Wheat", variety:"HD-2967", sow:"Nov", harvest:"Mar", spacing:"20x10 cm", fertilizer:"NPK 120:60:40 kg/ha", irrigation:"Every 10-12 days", rotation:"Follow legume crop"},
        {crop:"Gram", variety:"JG-11", sow:"Oct", harvest:"Feb", spacing:"30x10 cm", fertilizer:"Phosphorus rich fertilizer", irrigation:"Moderate", rotation:"Rotate with cereals"}
      ],
      zaid: [
        {crop:"Watermelon", variety:"Arka Manik", sow:"Apr", harvest:"Jun", spacing:"100x50 cm", fertilizer:"FYM+NPK 60:30:20", irrigation:"Daily drip", rotation:"After wheat or maize"},
        {crop:"Cucumber", variety:"Poinsett", sow:"Apr", harvest:"Jun", spacing:"60x60 cm", fertilizer:"Compost+NPK 50:30:20", irrigation:"Daily drip", rotation:"Use trellis for support"}
      ]
    },
    south: {
      kharif: [
        {crop:"Groundnut", variety:"VRI-2", sow:"Jun", harvest:"Sep", spacing:"30x10 cm", fertilizer:"FYM+NPK 80:40:40", irrigation:"Moderate", rotation:"After pulses"},
        {crop:"Cotton", variety:"LRA-5166", sow:"Jun", harvest:"Oct", spacing:"90x60 cm", fertilizer:"NPK 120:60:40", irrigation:"Weekly", rotation:"Rotate with cereals"}
      ],
      rabi: [
        {crop:"Ragi", variety:"GPU-28", sow:"Nov", harvest:"Feb", spacing:"30x10 cm", fertilizer:"FYM+NPK 60:30:20", irrigation:"Moderate", rotation:"Follow pulses"},
        {crop:"Horse Gram", variety:"VLG-1", sow:"Nov", harvest:"Feb", spacing:"20x10 cm", fertilizer:"Rhizobium + Compost", irrigation:"Low", rotation:"Rotate with cereals"}
      ],
      zaid: [
        {crop:"Moong", variety:"ML-131", sow:"Apr", harvest:"Jun", spacing:"30x10 cm", fertilizer:"Rhizobium culture", irrigation:"Weekly", rotation:"After cereals"}
      ]
    },
    east: {
      kharif: [
        {crop:"Paddy", variety:"Swarna", sow:"June", harvest:"Sept", spacing:"20x20 cm", fertilizer:"NPK 120:60:40", irrigation:"Flood 3-4 times", rotation:"Rotate with pulses"},
        {crop:"Maize", variety:"HQPM-1", sow:"July", harvest:"Oct", spacing:"60x20 cm", fertilizer:"NPK 150:75:50", irrigation:"Weekly", rotation:"Intercrop with beans"}
      ],
      rabi: [
        {crop:"Lentil", variety:"PL-406", sow:"Nov", harvest:"Feb", spacing:"30x10 cm", fertilizer:"Phosphorus rich", irrigation:"Moderate", rotation:"After cereals"},
        {crop:"Pea", variety:"Arkel", sow:"Nov", harvest:"Feb", spacing:"30x10 cm", fertilizer:"FYM+NPK 40:20:20", irrigation:"Moderate", rotation:"Rotate with maize or wheat"}
      ],
      zaid: [
        {crop:"Sesame", variety:"TS-3", sow:"Apr", harvest:"May", spacing:"30x10 cm", fertilizer:"FYM+NPK 30:20:10", irrigation:"Low", rotation:"Follow cereals"}
      ]
    },
    west: {
      kharif: [
        {crop:"Soybean", variety:"JS-335", sow:"Jun", harvest:"Sept", spacing:"30x10 cm", fertilizer:"NPK 100:50:50", irrigation:"Moderate", rotation:"Rotate with cotton"},
        {crop:"Cotton", variety:"LRA-5166", sow:"Jun", harvest:"Oct", spacing:"90x60 cm", fertilizer:"NPK 120:60:40", irrigation:"Weekly", rotation:"After cereals"}
      ],
      rabi: [
        {crop:"Wheat", variety:"GW-273", sow:"Nov", harvest:"Mar", spacing:"20x10 cm", fertilizer:"NPK 120:60:40", irrigation:"Every 10-12 days", rotation:"Follow legumes"},
        {crop:"Chickpea", variety:"JG-11", sow:"Nov", harvest:"Feb", spacing:"30x10 cm", fertilizer:"Phosphorus rich", irrigation:"Moderate", rotation:"Rotate with wheat"}
      ],
      zaid: [
        {crop:"Green Fodder", variety:"Hybrid Napier", sow:"Apr", harvest:"May", spacing:"30x10 cm", fertilizer:"FYM+NPK 50:30:20", irrigation:"Daily", rotation:"Rotate with cereals"},
        {crop:"Moong", variety:"ML-131", sow:"Apr", harvest:"Jun", spacing:"30x10 cm", fertilizer:"Rhizobium culture", irrigation:"Weekly", rotation:"After wheat or maize"}
      ]
    }
  };

  const data = schedules[region][season] || [];
  if(data.length === 0){
    alert("No schedule available for selected region/season.");
    return;
  }

  data.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.crop}</td>
                    <td>${item.variety}</td>
                    <td>${item.sow}</td>
                    <td>${item.harvest}</td>
                    <td>${item.spacing}</td>
                    <td>${item.fertilizer}</td>
                    <td>${item.irrigation}</td>
                    <td>${item.rotation}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById("scheduleCard").style.display = "block";
}
