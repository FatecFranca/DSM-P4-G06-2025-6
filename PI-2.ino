#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <time.h>

// Pinos SPI personalizados para ESP32
#define SS_PIN  21
#define RST_PIN 22

const char* ssid = "sua rede wifi"; // altere para os dados da sua rede wi-fi
const char* password = "senha";
const char* apiURL = "http://20.57.55.218:5000/smartlocker/api/v1/nfc-capture"; // Substitua pelo IP real

MFRC522 rfid(SS_PIN, RST_PIN);

int nfcCounter = 1;

// Função para obter data/hora formatada como "YYYY-MM-DD HH:MM:SS"
String getFormattedDateTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Falha ao obter hora local.");
    return "";
  }

  char buffer[25];
  sprintf(buffer, "%04d-%02d-%02d %02d:%02d:%02d",
    timeinfo.tm_year + 1900,
    timeinfo.tm_mon + 1,
    timeinfo.tm_mday,
    timeinfo.tm_hour,
    timeinfo.tm_min,
    timeinfo.tm_sec);

  return String(buffer);
}

String generateNfcTag() {
  char tag[10];
  sprintf(tag, "NFC%03d", nfcCounter++);
  return String(tag);
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Conectando ao Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" conectado!");

  // Configura o horário via NTP (UTC-3)
  configTime(-3 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  Serial.println("Sincronizando horário NTP...");
  delay(2000); // Aguarda sincronização

  SPI.begin(18, 19, 23, 21); // SCK, MISO, MOSI, SS
  rfid.PCD_Init();
  Serial.println("Aproxime sua tag...");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  String conteudo = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    conteudo.concat(String(rfid.uid.uidByte[i] < 0x10 ? " 0" : " "));
    conteudo.concat(String(rfid.uid.uidByte[i], HEX));
  }
  conteudo.toLowerCase();

  String tipoTag;
  if (conteudo.substring(1) == "f2 b1 ae 20") {
    tipoTag = "Chaveiro";
  } else if (conteudo.substring(1) == "42 36 5a 1a") {
    tipoTag = "Cartão";
  } else {
    tipoTag = "Cadastrada";
  }

  String datetime = getFormattedDateTime();
  if (datetime == "") {
    Serial.println("Data/hora inválida. Cancelando envio.");
    return;
  }

  String nfcTag = generateNfcTag();
  String jsonData = "{\"nfc_tag\": \"" + nfcTag + "\", \"datetime\": \"" + datetime + "\"}";

  Serial.println("JSON a enviar:");
  Serial.println(jsonData);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiURL);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonData);
    Serial.print("Código da resposta HTTP: ");
    Serial.println(httpResponseCode);
    Serial.println("Resposta do servidor:");
    Serial.println(http.getString());

    http.end();
  } else {
    Serial.println("Wi-Fi não conectado.");
  }

  Serial.print("Tag lida: ");
  Serial.println(tipoTag);
  delay(2000);
}




