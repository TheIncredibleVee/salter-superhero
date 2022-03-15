import './App.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {motion ,AnimatePresence} from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);



function App() {
  const [ searchText, setSearchText]=useState('');
  const [isLoading ,setIsLoading] = useState(false);
  const [result, setResult] =useState();
  const [bio, setBio]= useState(<li>"HI"</li>);
  const [defData ,setDefData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalHero, setModalHero] = useState('');
  const [powerStats, setPowerStats] = useState(null);
  const [heroNotFound, setHeroNotFound]= useState(false);
  const [chartData, setChartData] =useState(null);



  const openModal = (idx)=>{
    setModalHero(defData[idx].name);
    let stats=[];
    let labels=[];
    let data=[];
    for(const key in defData[idx].powerstats){
      labels.push(key);
      data.push(defData[idx].powerstats[key]);
      stats.push(<li><strong>{key}: </strong> {defData[idx].powerstats[key]}</li>);
    }
    setIsLoading(true);
    console.log({labels});
    console.log({data});
    let dataset=[
      {
        label: 'Power Stats',
        data : data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 255, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(0, 180, 10, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 255, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(0, 180, 10, 1)',
        ],
        borderWidth: 2,
      },
    ];
    console.log(dataset);
    let cData={
      labels: labels,
      datasets: dataset,
    };
    setChartData(cData);
    setIsLoading(false);
    console.log({chartData});
setPowerStats(stats);
    setModalIsOpen(true);
  };



  const closeModal=()=>setModalIsOpen(false);
  


  useEffect(() =>{
    console.log({searchText});
  },[searchText])

  useEffect(() =>{
    setHeroNotFound(false);
    const fetchData = async () =>{
      setIsLoading(true);
      const res = await axios.get("https://superhero-search.p.rapidapi.com/api/heroes", 
        {
          headers: {
            'x-rapidapi-host': 'superhero-search.p.rapidapi.com',
            'x-rapidapi-key': '858862b9c2mshe7542d7dd972b55p18f13bjsn5c961534ea57'
          }
        }
      );
      console.log(res.data);
      setDefData(res.data);
      setIsLoading(false);
    }
    fetchData();
  },[]);
  
  const dropIn ={
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };



  const submit=async (e)=>{
    e.preventDefault();
    setHeroNotFound(false);
    if(searchText===""){
      setResult(null);
      return;
    }
    setIsLoading(true);
    setSearchText("");
    setTimeout(()=>{
      setIsLoading(false);
    },3000);
    try{
      const temp= await axios.get("https://superhero-search.p.rapidapi.com/api/", 
        {
          params:{
            hero:searchText
          },
          headers: {
            'x-rapidapi-host': 'superhero-search.p.rapidapi.com',
            'x-rapidapi-key': '858862b9c2mshe7542d7dd972b55p18f13bjsn5c961534ea57'
          }
        }
      )
      if(temp.data==="Hero Not Found"){
        setResult('Error');
        setHeroNotFound(true);
      }
      else{
        let b=[]
        for(const key in temp.data.biography){
          if(Array.isArray(temp.data.biography[key])){
            b.push(<li><p className="text-gray-400"><strong>{key}</strong>: {temp.data.biography[key].join(', ')}</p></li>)
          }
          else{
            b.push(<li><p className="text-gray-400"><strong>{key}</strong>: {temp.data.biography[key]}</p></li>)
          }
        }
        setBio(b);
        setResult(temp.data);
        console.log(temp.data);

      }
    }
    catch(e){
      console.log(e);
    }
  }

  return (
    <div className="min-w-screen max-h-screen min-h-screen bg-gray-900 items-center justify-center px-5 py-5 overflow-auto">
      <div className="flex items-center justify-center">
        <div className="w-full rounded-xl bg-gray-100 shadow-lg p-6 text-gray-800 relative overflow-hidden min-w-80 max-w-3xl" >
            <div className="relative mt-1">
                <form onSubmit={submit}>
                  <input value={searchText} type="text" className="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Search..." onChange={(e)=>setSearchText(e.target.value)}/>
                </form>
                <button className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors" onClick={submit}>
                  <i className="mdi mdi-magnify"></i>
                  </button>
            </div>
            <div className="absolute top-0 left-0 w-full h-2 flex">
                <div className="h-2 bg-blue-500 flex-1"></div>
                <div className="h-2 bg-red-500 flex-1"></div>
                <div className="h-2 bg-yellow-500 flex-1"></div>
                <div className="h-2 bg-blue-500 flex-1"></div>
                <div className="h-2 bg-green-500 flex-1"></div>
                <div className="h-2 bg-red-500 flex-1"></div>
            </div>
        </div>
      </div>
      {isLoading && <div className="flex justify-center mt-2">
        <div className="flex-col">
            <svg viewBox="0 0 860.1 876.5">
              <path
                className="animate-spin from-blue-300"
                style={{stroke: 'black', strokeWidth: '1', transformOrigin: '33.47285199% 32.89218482%', animationDuration: '3s', fill: 'var(--tw-gradient-from)'}}
                d="M 289.209 146.527 C 251.329 146.527 215.76 161.251 189.083 187.986 C 162.406 214.721 147.624 250.232 147.624 288.112 C 147.624 325.99 162.348 361.387 189.083 388.237 C 215.76 414.914 251.445 429.696 289.209 429.696 C 327.088 429.696 362.657 414.972 389.335 388.237 C 416.011 361.503 430.794 325.99 430.794 288.112 C 430.794 250.232 416.069 214.836 389.335 187.986 C 362.657 161.308 327.088 146.527 289.209 146.527 Z M 289.209 406.022 C 223.902 406.022 171.241 353.129 171.241 288.053 C 171.241 222.977 223.902 170.085 289.209 170.085 C 354.516 170.085 407.177 223.036 407.177 288.053 C 407.177 353.072 354.516 406.022 289.209 406.022 Z M 536.462 229.099 L 514.058 229.099 C 495.753 229.099 480.452 213.739 480.452 194.915 C 480.452 185.503 484.437 177.073 491.538 170.72 L 505.974 156.574 C 520.294 142.427 520.294 119.446 505.974 105.125 L 473.119 72.559 C 466.651 66.091 457.066 62.222 447.308 62.222 C 437.549 62.222 428.137 66.034 421.497 72.559 L 407.639 86.416 C 400.998 93.808 391.874 97.792 382.29 97.792 C 363.408 97.792 347.356 82.432 347.356 64.301 L 347.356 42.013 C 347.356 22.091 331.88 5 311.959 5 L 267.093 5 C 246.768 5 230.542 21.975 230.542 42.013 L 230.542 64.417 C 230.542 82.548 214.894 97.907 196.07 97.907 C 186.658 97.907 178.054 93.923 171.587 86.994 L 157.267 72.847 C 150.799 66.206 141.215 62.511 131.455 62.511 C 121.697 62.511 112.285 66.322 105.645 72.847 L 72.789 105.298 C 58.642 119.446 58.642 142.6 72.789 156.632 L 86.647 170.49 C 94.038 177.13 98.139 185.503 98.139 195.088 C 98.139 213.97 82.779 229.271 64.532 229.271 L 42.128 229.271 C 21.918 229.099 5 245.613 5 265.707 L 5 288.112 L 5 310.516 C 5 330.437 21.976 347.067 42.128 347.067 L 64.532 347.067 C 82.836 347.067 98.139 362.426 98.139 381.25 C 98.139 390.663 94.038 399.381 86.647 406.022 L 72.789 419.591 C 58.642 433.739 58.642 456.72 72.789 470.925 L 105.645 503.664 C 112.112 510.305 121.697 514.001 131.455 514.001 C 141.215 514.001 150.627 510.189 157.267 503.664 L 171.587 489.518 C 177.766 482.589 186.484 478.604 195.896 478.604 C 214.778 478.604 230.369 493.964 230.369 512.095 L 230.369 534.499 C 230.369 554.42 246.595 571.512 266.804 571.512 L 311.612 571.512 C 331.65 571.512 348.337 554.536 348.337 534.499 L 348.337 512.095 C 348.337 493.964 363.812 478.604 382.693 478.604 C 392.106 478.604 400.825 482.704 407.639 489.98 L 421.497 503.838 C 428.137 510.305 437.549 514.173 447.308 514.173 C 457.066 514.173 466.478 510.363 473.119 503.838 L 505.974 471.097 C 520.121 456.951 520.121 433.796 505.974 419.649 L 491.538 405.502 C 484.437 399.15 480.452 390.143 480.452 380.904 C 480.452 362.022 495.811 346.085 514.058 346.085 L 536.462 346.085 C 556.499 346.085 570.819 330.898 570.819 310.862 L 570.819 288.169 L 570.819 265.765 C 570.819 245.613 556.499 229.099 536.462 229.099 Z M 547.549 288.053 L 547.549 310.342 C 547.549 316.521 544.142 322.006 536.809 322.006 L 514.405 322.006 C 499.218 322.006 484.783 328.474 473.87 339.675 C 463.129 350.762 457.182 365.313 457.182 380.673 C 457.182 396.61 463.649 411.334 475.602 422.247 L 489.633 436.106 C 494.484 441.129 494.484 449.386 489.633 454.237 L 456.778 486.977 C 454.41 489.171 451.004 490.499 447.481 490.499 C 443.959 490.499 440.378 489.171 438.185 486.977 L 424.731 473.581 C 413.355 461.628 398.457 454.988 382.693 454.988 C 367.334 454.988 353.187 460.878 342.158 471.502 C 330.956 482.415 325.066 496.735 325.066 512.037 L 325.066 534.441 C 325.066 541.66 318.715 547.837 311.959 547.837 L 267.093 547.837 C 260.337 547.837 254.275 541.66 254.275 534.441 L 254.275 512.037 C 254.275 496.851 248.211 482.415 237.009 471.502 C 225.922 460.878 211.487 454.988 196.3 454.988 C 180.653 454.988 165.639 461.628 154.841 473.292 L 141.156 486.977 C 138.789 489.171 135.382 490.499 131.86 490.499 C 128.337 490.499 124.758 489.344 122.852 487.266 L 122.679 487.092 L 122.506 486.919 L 89.65 454.179 C 84.8 449.329 84.8 441.187 89.65 436.163 L 103.047 422.883 C 115.114 411.68 121.755 396.783 121.755 380.846 C 121.755 365.487 115.865 351.513 105.067 340.426 C 94.154 329.225 79.718 323.45 64.532 323.45 L 41.955 323.45 C 34.564 323.45 28.385 317.098 28.385 310.458 L 28.385 287.881 L 28.385 265.476 C 28.385 258.836 34.564 252.484 41.955 252.484 L 64.359 252.484 C 79.546 252.484 93.981 246.71 104.894 235.508 C 115.634 224.422 121.582 210.159 121.582 194.972 C 121.582 179.036 114.942 164.138 102.873 153.11 L 89.304 139.713 C 86.07 136.48 85.608 132.784 85.608 130.705 C 85.608 128.8 86.07 124.931 89.304 121.698 L 122.043 89.131 C 124.411 86.936 127.818 85.608 131.34 85.608 C 134.862 85.608 138.443 86.763 140.349 88.842 L 140.521 89.015 L 140.695 89.188 L 154.553 103.046 C 165.467 114.826 180.19 121.351 196.012 121.351 C 211.371 121.351 225.634 115.461 236.72 104.837 C 247.922 93.923 254.101 79.603 254.101 64.301 L 254.101 41.897 C 254.101 34.679 259.991 28.501 266.631 28.501 L 311.612 28.501 C 318.253 28.501 323.392 34.679 323.392 41.897 L 323.392 64.301 C 323.392 79.488 329.859 93.923 341.061 104.837 C 352.148 115.461 366.699 121.351 382.059 121.351 C 397.996 121.351 413.008 114.71 424.211 102.757 L 437.607 89.361 C 439.974 87.167 443.381 85.839 446.903 85.839 C 450.426 85.839 454.006 87.167 456.2 89.246 L 489.056 121.813 C 491.423 124.18 492.866 127.414 492.866 130.821 C 492.866 134.228 491.538 137.461 489.171 139.828 L 475.14 153.687 C 463.36 164.6 456.72 179.325 456.72 195.261 C 456.72 210.621 462.609 224.595 473.407 235.681 C 484.321 246.883 498.757 252.657 513.943 252.657 L 536.346 252.657 C 544.315 252.657 547.26 260.048 547.433 265.938 L 547.549 288.053 Z"
                />
              <path
                className="animate-spin from-pink-300"
                style={{
                  stroke: 'black',
                  strokeWidth: '1',
                  transformOrigin: '74.01464945% 74.46662863%',
                  animationDuration: '4s',
                  animationDirection: 'reverse',
                  fill: 'var(--tw-gradient-from)',
                }}
                d="M 637.588 543.225 C 608.329 543.225 580.855 554.599 560.249 575.25 C 539.643 595.9 528.225 623.33 528.225 652.589 C 528.225 681.846 539.599 709.188 560.249 729.927 C 580.855 750.533 608.419 761.95 637.588 761.95 C 666.847 761.95 694.321 750.578 714.928 729.927 C 735.533 709.277 746.951 681.846 746.951 652.589 C 746.951 623.33 735.578 595.989 714.928 575.25 C 694.321 554.643 666.847 543.225 637.588 543.225 Z M 637.588 743.665 C 587.144 743.665 546.468 702.809 546.468 652.543 C 546.468 602.277 587.144 561.423 637.588 561.423 C 688.032 561.423 728.71 602.323 728.71 652.543 C 728.71 702.765 688.032 743.665 637.588 743.665 Z M 828.571 607.006 L 811.265 607.006 C 797.126 607.006 785.308 595.142 785.308 580.602 C 785.308 573.332 788.386 566.82 793.871 561.913 L 805.021 550.987 C 816.082 540.058 816.082 522.307 805.021 511.245 L 779.643 486.091 C 774.647 481.095 767.244 478.106 759.707 478.106 C 752.169 478.106 744.899 481.051 739.771 486.091 L 729.067 496.794 C 723.937 502.504 716.889 505.581 709.487 505.581 C 694.901 505.581 682.502 493.717 682.502 479.712 L 682.502 462.497 C 682.502 447.109 670.548 433.907 655.161 433.907 L 620.505 433.907 C 604.806 433.907 592.273 447.019 592.273 462.497 L 592.273 479.802 C 592.273 493.807 580.186 505.67 565.646 505.67 C 558.376 505.67 551.73 502.593 546.735 497.241 L 535.674 486.313 C 530.678 481.184 523.275 478.33 515.736 478.33 C 508.199 478.33 500.929 481.273 495.8 486.313 L 470.422 511.379 C 459.494 522.307 459.494 540.192 470.422 551.031 L 481.126 561.736 C 486.835 566.864 490.002 573.332 490.002 580.735 C 490.002 595.32 478.138 607.139 464.044 607.139 L 446.739 607.139 C 431.128 607.006 418.06 619.762 418.06 635.283 L 418.06 652.589 L 418.06 669.894 C 418.06 685.281 431.173 698.127 446.739 698.127 L 464.044 698.127 C 478.182 698.127 490.002 709.99 490.002 724.53 C 490.002 731.801 486.835 738.535 481.126 743.665 L 470.422 754.145 C 459.494 765.073 459.494 782.824 470.422 793.796 L 495.8 819.084 C 500.795 824.214 508.199 827.068 515.736 827.068 C 523.275 827.068 530.545 824.124 535.674 819.084 L 546.735 808.157 C 551.508 802.805 558.242 799.727 565.512 799.727 C 580.096 799.727 592.139 811.591 592.139 825.596 L 592.139 842.902 C 592.139 858.29 604.672 871.492 620.282 871.492 L 654.893 871.492 C 670.37 871.492 683.26 858.379 683.26 842.902 L 683.26 825.596 C 683.26 811.591 695.213 799.727 709.798 799.727 C 717.069 799.727 723.803 802.894 729.067 808.514 L 739.771 819.218 C 744.899 824.214 752.169 827.201 759.707 827.201 C 767.244 827.201 774.514 824.258 779.643 819.218 L 805.021 793.929 C 815.949 783.002 815.949 765.117 805.021 754.19 L 793.871 743.263 C 788.386 738.356 785.308 731.399 785.308 724.263 C 785.308 709.678 797.171 697.368 811.265 697.368 L 828.571 697.368 C 844.048 697.368 855.109 685.637 855.109 670.161 L 855.109 652.633 L 855.109 635.328 C 855.109 619.762 844.048 607.006 828.571 607.006 Z M 837.134 652.543 L 837.134 669.76 C 837.134 674.532 834.503 678.769 828.839 678.769 L 811.533 678.769 C 799.803 678.769 788.653 683.765 780.224 692.417 C 771.927 700.981 767.333 712.22 767.333 724.085 C 767.333 736.395 772.329 747.768 781.561 756.197 L 792.399 766.901 C 796.146 770.781 796.146 777.159 792.399 780.906 L 767.021 806.195 C 765.192 807.889 762.561 808.915 759.84 808.915 C 757.12 808.915 754.354 807.889 752.66 806.195 L 742.268 795.847 C 733.482 786.615 721.974 781.486 709.798 781.486 C 697.933 781.486 687.006 786.035 678.487 794.241 C 669.834 802.671 665.285 813.732 665.285 825.551 L 665.285 842.858 C 665.285 848.434 660.379 853.205 655.161 853.205 L 620.505 853.205 C 615.287 853.205 610.605 848.434 610.605 842.858 L 610.605 825.551 C 610.605 813.821 605.921 802.671 597.268 794.241 C 588.704 786.035 577.554 781.486 565.824 781.486 C 553.738 781.486 542.141 786.615 533.8 795.624 L 523.229 806.195 C 521.401 807.889 518.77 808.915 516.049 808.915 C 513.328 808.915 510.563 808.023 509.091 806.418 L 508.958 806.283 L 508.824 806.15 L 483.445 780.861 C 479.699 777.115 479.699 770.826 483.445 766.945 L 493.793 756.688 C 503.114 748.035 508.244 736.528 508.244 724.218 C 508.244 712.355 503.694 701.561 495.354 692.997 C 486.924 684.345 475.774 679.884 464.044 679.884 L 446.605 679.884 C 440.896 679.884 436.123 674.978 436.123 669.849 L 436.123 652.41 L 436.123 635.104 C 436.123 629.976 440.896 625.069 446.605 625.069 L 463.91 625.069 C 475.641 625.069 486.791 620.609 495.22 611.957 C 503.516 603.394 508.11 592.377 508.11 580.646 C 508.11 568.337 502.981 556.829 493.659 548.31 L 483.178 537.962 C 480.68 535.465 480.323 532.61 480.323 531.004 C 480.323 529.532 480.68 526.544 483.178 524.047 L 508.466 498.891 C 510.295 497.196 512.927 496.17 515.647 496.17 C 518.368 496.17 521.134 497.062 522.606 498.668 L 522.739 498.802 L 522.873 498.935 L 533.578 509.64 C 542.008 518.739 553.38 523.779 565.601 523.779 C 577.465 523.779 588.482 519.229 597.045 511.023 C 605.697 502.593 610.47 491.532 610.47 479.712 L 610.47 462.407 C 610.47 456.832 615.02 452.06 620.149 452.06 L 654.893 452.06 C 660.022 452.06 663.992 456.832 663.992 462.407 L 663.992 479.712 C 663.992 491.443 668.987 502.593 677.64 511.023 C 686.203 519.229 697.443 523.779 709.308 523.779 C 721.618 523.779 733.214 518.649 741.866 509.416 L 752.213 499.069 C 754.042 497.374 756.673 496.349 759.394 496.349 C 762.115 496.349 764.88 497.374 766.575 498.98 L 791.953 524.136 C 793.782 525.964 794.896 528.462 794.896 531.094 C 794.896 533.725 793.871 536.222 792.042 538.051 L 781.204 548.756 C 772.105 557.186 766.977 568.56 766.977 580.869 C 766.977 592.733 771.525 603.527 779.866 612.09 C 788.296 620.743 799.447 625.203 811.177 625.203 L 828.481 625.203 C 834.636 625.203 836.911 630.912 837.045 635.461 L 837.134 652.543 Z"
                />
            </svg>
          <div className="mt-3 text-gray-200 font-mono text-sm sm:text-xs">Loading...</div>
        </div>
      </div>}
      {result && !heroNotFound && !isLoading && (
        <div className="flex flex-col gap-4 items-center justify-center mt-6 ">
        <a href="google.com" className="w-[48rem] bg-green-800 border-2 border-b-4 border-gray-200 rounded-xl hover:bg-gray-500">
          <div className="grid grid-cols-4 p-5 gap-y-2">
            <div>
              <img src={result.images.md} className="max-w-64 max-h-64 ml-2 rounded-full" alt="img"/>
            </div>
            <div className="col-span-3 md:col-span-3 ml-12">
              <p className="text-sky-500 font-bold text-mdf"> {result.name}</p>
              <p className="text-white font-bold text-xl" > {result.biography.fullName}</p>
              <ul style={{listStyleType:'disc'}}>
                  {
                    bio
                  }
              </ul>
            </div>
          </div>
        </a>
      </div>
      )
      }
      {result && heroNotFound && !isLoading && (
        <div className="flex items-center justify-center mt-6 ">
          <div className=" w-full max-w-3xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">No result found! </strong>
            <span className="block sm:inline">Check the spelling and try again.</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <button className="-mt-3" onClick={(e)=>{setResult('');setHeroNotFound(false);}}>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </button>
            </span>
          </div>
      </div>
      )
      }
      {!result && !isLoading && (<>
       <div className="flex items-center justify-center mt-6">
         <div className="col-span-12 w-[48rem] max-h-[50rem] overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-blue-600 scrollbar-thumb-rounded-full scrollbar-track-rounded-full" >
           <div className="overflow-auto lg:overflow-visible ">
             <table className="table text-gray-400 border-separate space-y-4 w-full text-md pr-2 -mt-3">
               <thead className="bg-gray-800 text-gray-500">
                 <tr>
                   
                  <th className="p-3 text-center">Image</th>
                   <th className="p-3 text-left">Name</th>
                   <th className="p-3 text-left">Full Name</th>
                   <th className="p-3 text-left">Gender</th>
                   
                 
                 </tr>
               </thead>
               <tbody>
                 {defData.map((val,idx)=>(
                   <>
                      <tr className="bg-gray-800">
                        <td className="p-3 items-center justify-center">
                            <img className="rounded-full w-full h-20 -m-1" src={val.images.md} alt="unsplash"/>
                        </td>
                        <td className="p-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="save-button"
                            onClick={(e)=>openModal(idx)}
                          >
                          {val.name}
                          </motion.button>
                        </td>
                        <td className="p-3">
                          {val.biography.fullName}
                        </td>
                        <td className="p-3 font-bold">
                          {val.appearance.gender}
                        </td>
                      </tr>
                  </>

                 ))}
               </tbody>
             </table>
           </div>
         </div>
       </div>
       </>
      )}
      <ModalContainer>
        {modalIsOpen && (
          <Modal modalOpen={openModal} text={modalHero} type={dropIn} handleClose={closeModal} powerStats={powerStats} data={chartData}/>
        )}
      </ModalContainer>
    </div>
  );
}

const ModalContainer = ({ children}) => (
  <AnimatePresence
    initial={false}
    exitBeforeEnter={true}
  >
    {children}
  </AnimatePresence>
);



const Modal =({modalOpen,text,type, handleClose, powerStats, data}) =>{
  return (
    <Backdrop onClick={handleClose}>
        <motion.div
          onClick={(e) => e.stopPropagation()}  // Prevent click from closing modal
          className="modal orange-gradient"
          variants={type}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ModalText text={text} powerStats={powerStats} data={data} />
          <ModalButton onClick={handleClose} label="Close" />
        </motion.div>

    </Backdrop>
  );
};



const ModalText = ({ text, powerStats, data }) => (
  <>
  <div className="modal-text">
    <h3 className="text-blue-800">{text}</h3>
    <div className="text-center text-2xl">
      Power Stats
    </div>    
  </div>
  <div className="flex">
    <ul className="p-3 text-left w-full">
      {powerStats}
    </ul>
    <div className=" -mt-12 h-72 w-72">

      <Doughnut data={data} options={{
                        plugins: {
                            legend:{
                                labels: {
                                    color: 'white',
                                },
                                position: 'right',
                            },
                            title: {
                              color:'red',
                            },
                            scales: {
                                yAxes: [{
                                   ticks: {
                                      beginAtZero: true,
                                      color: 'white'
                                   },
                                }],
                                xAxes: [{
                                   ticks: {
                                      color: 'white'
                                   },
                                }]
                             },
                          },
                        responsive: true,
                        maintainAspectRatio: true,
                    }}
      />
    </div>

  </div>
  </>
);

const ModalButton = ({ onClick, label }) => (
  <motion.button
    className="modal-button"
    type="button"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {label}
  </motion.button>
);


const Backdrop = ({ children, onClick }) => {
  return (
    <motion.div
      className="backdrop"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};


export default App;
