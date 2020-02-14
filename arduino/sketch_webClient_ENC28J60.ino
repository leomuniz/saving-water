#include <MD5.h>
#include <EtherCard.h>
#include <RTC_DS3231.h>
#include <avr/wdt.h>

RTC_DS3231 rtc(1);

// ethernet interface mac address, must be unique on the LAN
static byte mymac[] = { 0x74,0x69,0x69,0x2D,0x30,0x31 };

byte Ethernet::buffer[700];
static uint32_t timer = 10000; // não envia post nos 10 primeiros segundos
static uint32_t timeout; // timer para timeout
int timeouts = 0; // conta o número de timeouts para resetar o Arduino

#define pulsoPin 3
volatile int incPulso = 0;
int lastPulso = 0;
String idPulso;
String data;
String token;
String datahora;
String id_sensor;

char dataChar[350];

boolean waitingResponse = false;
boolean resetNOW = false;

//const char website[] PROGMEM = "www.bontec.com.br";
const char website[] PROGMEM = "104.236.16.28";

// called when the client request is complete
static void my_callback (byte status, word off, word len) {
  Serial.println(">>>");
  Ethernet::buffer[off+300] = 0;
  Serial.print((const char*) Ethernet::buffer + off);
  Serial.println("...");
  waitingResponse = false;
}

void setup () {
  // ARDUINO MEGA ONLY: pins 19 e 18 Vcc e GND, respectivamente, pra ativar o RTC DS3231 encaixado direto no arduino
  pinMode(19, OUTPUT);
  digitalWrite(19, HIGH);
  pinMode(18, OUTPUT);
  digitalWrite(18, LOW);
  // ARDUINO MEGA ONLY: pins 19 e 18 Vcc e GND pra ativar o RTC DS3231
  
  Serial.begin(9600);
  Serial.println("\n[webClient]");

  pinMode(pulsoPin, INPUT_PULLUP);            
  attachInterrupt(digitalPinToInterrupt(pulsoPin), pulso, FALLING);


  if (ether.begin(sizeof Ethernet::buffer, mymac,53) == 0)  { // 53 => ARDUINO MEGA ONLY!! 
    Serial.println( "Failed to access Ethernet controller");
    resetNOW = true;
  }
  
  if (!ether.dhcpSetup()) {
    Serial.println("DHCP failed");
    resetNOW = true;
  }

  ether.printIp("IP:  ", ether.myip);
  ether.printIp("GW:  ", ether.gwip);  
  ether.printIp("DNS: ", ether.dnsip);  

static byte dnsip[] = {189,125,19,198};
ether.copyIp(ether.dnsip, dnsip);
ether.printIp("DNS IP: ", ether.dnsip);

  //if (!ether.dnsLookup(website))
    //Serial.println("DNS failed");
    
  
  ether.hisip[0] = 104;
  ether.hisip[1] = 236;
  ether.hisip[2] = 16;
  ether.hisip[3] = 28;
  ether.printIp("SRV: ", ether.hisip);
  //ether.hisport = 8088;

  wdt_enable(WDTO_8S); // enable 8s of watchdog
  if (resetNOW) { resetArduino(); } // reset no arduino caso o DHCP falhe ou não seja possível conexão com o ENC28J60  
}

void pulso() { incPulso++; }

void loop () {
  wdt_reset(); // reset watchdog
  ether.packetLoop(ether.packetReceive());
  
  if (incPulso != lastPulso) {
    Serial.println(incPulso);
  }
 
  lastPulso = incPulso;
  
  if ((millis() > timer) && (!waitingResponse)) { 
    waitingResponse = true;
    timer = millis() + 5000;
    timeout = millis() + 20000; // 20 segundos de timeout
    Serial.println();
    Serial.print("<<< REQ ");

    token = "&token=***************************";
    datahora = rtc.ISOdate();
    id_sensor = "paissandu334_hidr_entr";

    char *id_post = md5(id_sensor, datahora);

    data = "id_post=";
    data += id_post;
    data += "&datahora=";
    data += datahora;
    data += "&id_sensor=";
    data += id_sensor;
    data += "&valor=";
    data += incPulso; // é preciso concatenar int assim, se não, não funciona
    data += token;
    Serial.println(data);
    data.toCharArray(dataChar, 350);
    //ether.browseUrl(PSTR("/api/leituras/"), "?token=***************************", website, my_callback);    
    ether.httpPost(PSTR("/api/leituras/"), website, 0, dataChar, my_callback);
    incPulso = 0;
  }

  if (waitingResponse) {  
    if(millis() > timeout) {
      timeouts++;
      Serial.println("Timeout!");
      waitingResponse = false; // libera o ENC28J60 para um novo post
      if (timeouts > 10) {
         Serial.println(">10 timeouts consecutivos");
         Serial.println("Reinicinado Arduino...");
         resetArduino();
      }
    }
  }
}

char* md5(String id_sensor, String datahora) {
    char id_postChar[70];
    String id_post = id_sensor + datahora;
    id_post.toCharArray(id_postChar,70);
    unsigned char* hash=MD5::make_hash(id_postChar);
    char *md5str = MD5::make_digest(hash, 16);
    free(hash);
    return md5str;
}


void resetArduino () {
  for (;;) {}  // infinite loop to wait watchdog restart-it 
}

