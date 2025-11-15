import { ForcastObject } from "../interface/forcast-array";
import Image from "next/image";

export const Forcast = ( props : ForcastObject) => {
    //console.log('prop', props);
    return (
    <div style={{
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }} className="text-xs">
      {/* <pre>
        {JSON.stringify(prop, null, 2)}
      </pre> */}
      <h2 className="font-bold text-xl">Weather Forecast</h2>
      <div>
        <p className="mt-2 mb-2">Location: {props.city.name}, Country: {props.city.country}</p>
        <div className="flex">
          {props.list.map((item, index) => {
            const date = new Date(item.dt * 1000);
            return  <div key={index} className="flex-1 pr-1 pl-1">
                      <div className="mb-1">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div>from {item.temp.min}°C</div>
                      <div>to {item.temp.max}°C</div>
                      <div className="mt-1 h-8">{item.weather[0].description}</div>
                      <div>
                        <Image
                          src={`/icons/${item.weather[0].icon}@2x.png`}
                          alt={item.weather[0].description}
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
          })}
        </div>
      </div>
    </div>
  );
};