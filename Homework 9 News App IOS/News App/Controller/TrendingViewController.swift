//
//  TrendingViewController.swift
//  News App
//
//  Created by Allen on 4/12/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import Charts


class TrendingViewController: UIViewController, ChartViewDelegate, UITextFieldDelegate {
    
    
    @IBOutlet weak var chartView: LineChartView!
    
    @IBOutlet weak var searchField: UITextField!
    
    
    var trendManager = TrendManager()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setData("coronavirus")
        searchField.delegate = self
    }
    
    
    func setData(_ searchResult: String) {
        var yValue: [ChartDataEntry] = []
        var keyword: String = ""
        
        self.trendManager.fetchTrendData(searchResult) {value in
            
            keyword = value["keyword"].string!
            
            for i in 0...(value["dataArr"].count - 1) {
                //                print(value["dataArr"][i].int!)
                yValue.append(ChartDataEntry(x: Double(i + 1), y: Double(value["dataArr"][i].int!)))
            }
            
            let set = LineChartDataSet(entries: yValue, label: "Trending Chart for \(keyword)")
            set.setCircleColor(.systemBlue)
            set.setColor(.systemBlue)
            set.drawCircleHoleEnabled = false
            set.circleRadius = 5
            
            let data = LineChartData(dataSet: set)
            self.chartView.data = data
        }
        
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        searchField.endEditing(true)
        return true
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        if let keyword = searchField.text {
            setData(keyword)
        }
            
        else {
            searchField.text = ""
        }
    }
    

}




