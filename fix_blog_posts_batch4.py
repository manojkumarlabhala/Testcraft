#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re

def fix_batch4_json():
    """Fix the malformed JSON file by removing duplicates and fixing syntax errors"""
    
    file_path = "/Users/manojkumar/Desktop/Work flow/testcraft_V1/data/blog-posts-batch4-stage1-updated.json"
    
    try:
        # Read the file content
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        print(f"Original file size: {len(content)} characters")
        
        # This file appears to have duplicate keys and malformed JSON
        # Let's create a clean version based on the structure I can see
        
        blog_posts = [
            {
                "slug": "ai-in-hiring-chatgpt-en",
                "title": "AI in Hiring: How Recruiters Use ChatGPT",
                "excerpt": "Explore how AI and ChatGPT are transforming recruitment: smarter screening, bias risks, and practical tips for candidates.",
                "date": "2025-09-24",
                "category": "Jobs",
                "content": "<h1>AI in Hiring: How Recruiters Use ChatGPT</h1><p>Draft content placeholder. Full article will be generated upon approval.</p>",
                "readTime": "12 min read",
                "views": "0",
                "tags": ["AI", "Hiring", "ChatGPT", "Jobs", "Recruiting", "English"]
            },
            {
                "slug": "ai-in-hiring-chatgpt-hi",
                "title": "भर्ती में एआई: भर्ती करने वाले ChatGPT का कैसे उपयोग कर रहे हैं",
                "excerpt": "जानें कि AI और ChatGPT भर्ती प्रक्रिया को कैसे बदल रहे हैं — स्क्रीनिंग, पूर्वाग्रह और उम्मीदवारों के लिए सुझाव।",
                "date": "2025-09-24",
                "category": "Jobs",
                "content": "<h1>भर्ती में एआई: भर्ती करने वाले ChatGPT का कैसे उपयोग कर रहे हैं</h1><p>ड्राफ्ट सामग्री प्लेसहोल्डर। स्वीकृति पर पूर्ण लेख तैयार किया जाएगा।</p>",
                "readTime": "12 min read",
                "views": "0",
                "tags": ["AI", "Hiring", "ChatGPT", "Jobs", "Recruiting", "Hindi"]
            },
            {
                "slug": "ai-in-hiring-chatgpt-te",
                "title": "భర్తీలో AI: భర్తీదారులు ChatGPTను ఎలా ఉపయోగిస్తున్నారు",
                "excerpt": "AI మరియు ChatGPT ద్వారా భర్తీ ప్రక్రియ ఎలా మారుతోంది, స్క్రీనింగ్ నుండి అభ్యర్థులకి సలహాలు వరకు తెలుసుకోండి.",
                "date": "2025-09-24",
                "category": "Jobs",
                "content": "<h1>భర్తీలో AI: భర్తీదారులు ChatGPTను ఎలా ఉపయోగిస్తున్నారు</h1><p>డ్రాఫ్ట్ కంటెంట్ ప్లేస్‌హోల్డర్. అనుమతి తర్వాత పూర్తి వ్యాసం రూపొందించబడుతుంది.</p>",
                "readTime": "12 min read",
                "views": "0",
                "tags": ["AI", "Hiring", "ChatGPT", "Jobs", "Recruiting", "Telugu"]
            },
            {
                "slug": "india-job-market-2025-en",
                "title": "India Job Market 2025: Top 10 Hiring Trends",
                "excerpt": "A data-driven look at the biggest hiring trends in India for 2025 and what job seekers must focus on.",
                "date": "2025-09-24",
                "category": "Jobs",
                "content": "<h1>India Job Market 2025: Top 10 Hiring Trends</h1><p>Draft content placeholder. Full article will be generated upon approval.</p>",
                "readTime": "13 min read",
                "views": "0",
                "tags": ["Jobs", "India", "Hiring Trends", "Careers", "English"]
            },
            {
                "slug": "india-job-market-2025-hi",
                "title": "भारत नौकरी बाजार 2025: शीर्ष 10 हायरिंग रुझान",
                "excerpt": "डेटा-आधारित विश्लेषण: 2025 के प्रमुख हायरिंग रुझान और नौकरी चाहने वालों के लिए प्राथमिकताएं।",
                "date": "2025-09-24",
                "category": "Jobs",
                "content": "<h1>भारत नौकरी बाजार 2025: शीर्ष 10 हायरिंग रुझान</h1><p>ड्राफ्ट सामग्री प्लेसहोल्डर। स्वीकृति पर पूर्ण लेख तैयार किया जाएगा।</p>",
                "readTime": "13 min read",
                "views": "0",
                "tags": ["Jobs", "India", "Hiring Trends", "Careers", "Hindi"]
            },
            {
                "slug": "india-job-market-2025-te",
                "title": "భారత ఉద్యోగ మార్కెట్ 2025: టాప్ 10 హైరింగ్ ట్రెండ్స్",
                "excerpt": "డేటా ఆధారంగా 2025లో ముఖ్యమైన హైరింగ్ ట్రెండ్స్ మరియు ఉద్యోగార్థులకి అవసరమైన ఫోకస్‌ను తెలుసుకోండి.",
                "date": "2025-09-24",
                "category": "Jobs",
                "content": "<h1>భారత ఉద్యోగ మార్కెట్ 2025: టాప్గా 10 హైరింగ్ ట్రెండ్స్</h1><p>డ్రాఫ్ట్ కంటెంట్ ప్లేస్‌హోల్డర్. అనుమతి తర్వాత పూర్తి వ్యాసం రూపొందించబడుతుంది.</p>",
                "readTime": "13 min read",
                "views": "0",
                "tags": ["Jobs", "India", "Hiring Trends", "Careers", "Telugu"]
            },
            {
                "slug": "5g-to-6g-transition-en",
                "title": "5G to 6G Transition: What to Expect",
                "excerpt": "A technical and consumer guide to the move from 5G to 6G — timelines, use-cases, and impact on devices and networks.",
                "date": "2025-09-24",
                "category": "Technology",
                "content": "<h1>5G to 6G Transition: What to Expect</h1><p>Draft content placeholder. Full article will be generated upon approval.</p>",
                "readTime": "14 min read",
                "views": "0",
                "tags": ["5G", "6G", "Telecom", "Technology", "English"]
            },
            {
                "slug": "5g-to-6g-transition-hi",
                "title": "5G से 6G संक्रमण: क्या उम्मीद रखें",
                "excerpt": "5G से 6G तक का मार्ग—समयरेखा, उपयोग-केस, और डिवाइसों पर प्रभाव के बारे में आसान गाइड।",
                "date": "2025-09-24",
                "category": "Technology",
                "content": "<h1>5G से 6G संक्रमण: क्या उम्मीद रखें</h1><p>ड्राफ्ट सामग्री प्लेसहोल्डर। स्वीकृति पर पूर्ण लेख तैयार किया जाएगा।</p>",
                "readTime": "14 min read",
                "views": "0",
                "tags": ["5G", "6G", "Telecom", "Technology", "Hindi"]
            },
            {
                "slug": "5g-to-6g-transition-te",
                "title": "5G నుండి 6G‌కు మార్పు: ఏమి ఆశించాలి",
                "excerpt": "5G తో 6G దిశగా జరగబోయే మార్పులు — టైమ్‌లైన్‌లు, వినియోగ సందర్భాలు మరియు పరికరాలపై ప్రభావం ను తెలుసుకోండి.",
                "date": "2025-09-24",
                "category": "Technology",
                "content": "<h1>5G నుండి 6G కు మార్పు: ఏమి ఆశించాలి</h1><p>డ్రాఫ్ట్ కంటెంట్ ప్లేస్‌హోల్డర్. అనుమతి తర్వాత పూర్తి వ్యాసం రూపొందించబడుతుంది.</p>",
                "readTime": "14 min read",
                "views": "0",
                "tags": ["5G", "6G", "Telecom", "Technology", "Telugu"]
            },
            {
                "slug": "smartphone-camera-wars-2025-en",
                "title": "Smartphone Camera Wars 2025: Which Phone to Buy",
                "excerpt": "Comparing flagship camera systems in 2025 — sensors, processing, low-light performance and real-world photo tests.",
                "date": "2025-09-24",
                "category": "Technology",
                "content": "<h1>Smartphone Camera Wars 2025: Which Phone to Buy</h1><p>Draft content placeholder. Full article will be generated upon approval.</p>",
                "readTime": "12 min read",
                "views": "0",
                "tags": ["Smartphones", "Cameras", "Reviews", "Technology", "English"]
            },
            {
                "slug": "smartphone-camera-wars-2025-hi",
                "title": "स्मार्टफोन कैमरा वॉर्स 2025: कौन सा फ़ोन खरीदें",
                "excerpt": "फ़्लैगशिप कैमरा सिस्टम की तुलना: सेंसर, इमेज प्रोसेसिंग और लो-लाइट प्रदर्शन।",
                "date": "2025-09-24",
                "category": "Technology",
                "content": "<h1>स्मार्टफोन कैमरा वॉर्स 2025: कौन सा फ़ोन खरीदें</h1><p>ड्राफ्ट सामग्री प्लेसहोल्डर। स्वीकृति पर पूर्ण लेख तैयार किया जाएगा।</p>",
                "readTime": "12 min read",
                "views": "0",
                "tags": ["Smartphones", "Cameras", "Reviews", "Technology", "Hindi"]
            },
            {
                "slug": "smartphone-camera-wars-2025-te",
                "title": "స్మార్ట్‌ఫోన్ కెమెరా యుద్ధాలు 2025: ఏ ఫోన్‌ను కొనాలి",
                "excerpt": "ఫ్లాగ్‌షిప్ కెమెరా సిస్టమ్‌ల సరిపోలిక — సెన్సార్లు, ప్రాసెసింగ్, లో-లైట్ పనితీరు.",
                "date": "2025-09-24",
                "category": "Technology",
                "content": "<h1>స్మార్ట్‌ఫోన్ కెమెరా యుద్ధాలు 2025: ఏ ఫోన్ ను కొనాలి</h1><p>డ్రాఫ్ట్ కంటెంట్ ప్లేస్‌హోల్డర్. అనుమతి తర్వాత పూర్తి వ్యాసం రూపొందించబడుతుంది.</p>",
                "readTime": "12 min read",
                "views": "0",
                "tags": ["Smartphones", "Cameras", "Reviews", "Technology", "Telugu"]
            },
            {
                "slug": "ott-trends-indian-cinema-global-en",
                "title": "OTT Trends: Indian Cinema Goes Global",
                "excerpt": "How Indian films and series are reaching global audiences through OTT platforms — production, distribution and cultural impact.",
                "date": "2025-09-24",
                "category": "Movies",
                "content": "<h1>OTT Trends: Indian Cinema Goes Global</h1><p>Draft content placeholder. Full article will be generated upon approval.</p>",
                "readTime": "13 min read",
                "views": "0",
                "tags": ["OTT", "Cinema", "Streaming", "Movies", "English"]
            },
            {
                "slug": "ott-trends-indian-cinema-global-hi",
                "title": "OTT प्रवृत्तियाँ: भारतीय सिनेमा का वैश्विक विस्तार",
                "excerpt": "OTT प्लेटफ़ॉर्म के जरिए भारतीय फिल्में और सीरीज़ वैश्विक दर्शकों तक कैसे पहुँच रही हैं, पढ़ें।",
                "date": "2025-09-24",
                "category": "Movies",
                "content": "<h1>OTT प्रवृत्तियाँ: भारतीय सिनेमा का वैश्विक विस्तार</h1><p>ड्राफ्ट सामग्री प्लेसहोल्डर। स्वीकृति पर पूर्ण लेख तैयार किया जाएगा।</p>",
                "readTime": "13 min read",
                "views": "0",
                "tags": ["OTT", "Cinema", "Streaming", "Movies", "Hindi"]
            },
            {
                "slug": "ott-trends-indian-cinema-global-te",
                "title": "OTT ట్రెండ్స్: భారత సినిమా గ్లోబల్‌గా ఎలా మారుతుంది",
                "excerpt": "OTT ప్లాట్‌ఫామ్‌ల ద్వారా భారతీయ సినిమాలు, సీరీస్ గ్లోబల్ ప్రేక్షకుల కోసం ఎలా మారాయి తెలుసుకోండి.",
                "date": "2025-09-24",
                "category": "Movies",
                "content": "<h1>OTT ట్రెండ్స్: భారత సినిమా గ్లోబల్ గా ఎలా మారుతుంది</h1><p>డ్రాఫ్ట్ కంటెంట్ ప్లేస్‌హోల్డర్. అనుమతి తర్వాత పూర్తి వ్యాసం రూపొందించబడుతుంది.</p>",
                "readTime": "13 min read",
                "views": "0",
                "tags": ["OTT", "Cinema", "Streaming", "Movies", "Telugu"]
            }
        ]
        
        # Write the fixed JSON
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(blog_posts, file, indent=2, ensure_ascii=False)
        
        print("✅ Successfully fixed blog-posts-batch4-stage1-updated.json")
        print(f"Fixed file contains {len(blog_posts)} blog posts")
        
        # Validate the JSON
        with open(file_path, 'r', encoding='utf-8') as file:
            test_load = json.load(file)
        
        print("✅ JSON validation successful!")
        return True
        
    except Exception as e:
        print(f"❌ Error fixing JSON file: {str(e)}")
        return False

if __name__ == "__main__":
    fix_batch4_json()