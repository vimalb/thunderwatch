

int POWER = 1;
int FOCUS = 3;
int SHUTTER = 4;

// the setup function runs once when you press reset or power the board
void setup() {
  Serial.begin(9600);

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(POWER, OUTPUT);
  pinMode(FOCUS, OUTPUT);
  pinMode(SHUTTER, OUTPUT);

  digitalWrite(LED_BUILTIN, LOW);
  digitalWrite(POWER, LOW);
  digitalWrite(FOCUS, HIGH);
  digitalWrite(SHUTTER, HIGH);
  
}

// the loop function runs over and over again forever
void loop() {
  if (Serial.available() > 0) {
    int incomingByte = Serial.read() - 48;
    if(incomingByte >= 0 && incomingByte < 8) {
      digitalWrite(POWER, (incomingByte & 1) > 0);
      digitalWrite(FOCUS, (incomingByte & 2) > 0);
      digitalWrite(SHUTTER, (incomingByte & 4) > 0);
      Serial.println(incomingByte, DEC);
    }
  }
}

