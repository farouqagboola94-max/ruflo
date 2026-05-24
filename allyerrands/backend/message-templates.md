# Za.allyErrands — WhatsApp Message Templates

All templates below are exact copy-paste ready.
Variables are in `{{double_braces}}`.
Bold uses WhatsApp markdown: `*text*`.
Italics: `_text_`.

---

## CLIENT MESSAGES

### 1. Request Received + Payment Link
> Sent immediately when client submits the form. Includes Flutterwave link.

```
⚡ *Za.allyErrands*

Your request is logged.

*Job:* {{item_description}}
*Pickup:* {{pickup_address}}
*Amount:* ₦{{amount_ngn}}

To lock in your runner and trigger immediate dispatch, complete your payment here:
{{payment_link}}

_Payment is secure via Flutterwave. Your ally moves the moment it clears._
```

---

### 2. Payment Confirmed
> Sent by the flw-webhook Edge Function the moment Flutterwave confirms.

```
✅ *Za.allyErrands — Payment Confirmed*

₦{{amount}} received. Your runner is being dispatched now.

*Job:* {{item_description}}
*Pickup:* {{pickup_address}}

Track your run live: zallyerrands.com/portal

_Do not reply to this number. Updates will come through automatically._
```

---

### 3. Runner Assigned
> Send manually or automate from admin panel when you assign a runner.

```
🏃 *Za.allyErrands — Runner Assigned*

Your ally is on the way.

*Runner:* {{runner_name}}
*Job:* {{item_description}}
*Pickup:* {{pickup_address}}

Estimated time: {{estimated_mins}} minutes.
Track live: zallyerrands.com/portal
```

---

### 4. Runner En Route
> Trigger this when status changes to "En Route".

```
🚦 *Za.allyErrands — En Route*

Your ally is moving.

*Job:* {{item_description}}
*From:* {{pickup_address}}
*To:* {{dropoff_address}}

ETA: {{estimated_mins}} minutes. Stand by.
```

---

### 5. Errand Completed
> Trigger when status changes to "Completed".

```
✅ *Za.allyErrands — Complete*

Job done. Your errand has been delivered.

*Job:* {{item_description}}
*Job ID:* {{tx_ref}}

Thank you for using Za.allyErrands.
Book your next run: zallyerrands.com
```

---

### 6. Payment Failed / Not Completed
> Send if client doesn’t pay within 30 minutes (set a Make.com delay).

```
⏰ *Za.allyErrands — Action Required*

Your errand request is still pending. Your runner cannot be dispatched until payment is complete.

Complete payment here:
{{payment_link}}

Link expires in 24 hours. Reply CANCEL to withdraw the request.
```

---

## PHALANX GROUP CHAT TEMPLATES

### P1. New Request — Standby (Awaiting Payment)
> Fires the moment a request is submitted.

```
📥 NEW REQUEST — AWAITING PAYMENT

ID: {{request_id}}
Client: {{client_name}} | {{client_phone}}
Pickup: {{pickup}}
Drop-off: {{dropoff}}
Item: {{description}}
Amount: ₦{{amount}}

Standby. Dispatch triggers automatically when payment clears.
```

---

### P2. DISPATCH NOW — Payment Confirmed (Priority Alert)
> Fires the moment Flutterwave confirms. This is the hard trigger.

```
✅ PAYMENT CONFIRMED — DISPATCH NOW

Job ID: {{request_id}}
TX Ref: {{tx_ref}}
Client: {{client_name}} | {{client_phone}}
Pickup: {{pickup}}
Drop-off: {{dropoff}}
Item: {{description}}
Paid: ₦{{amount}}
Time: {{paid_at}}

🔴 ASSIGN A RUNNER NOW. Client is watching the portal.
```

---

### P3. Runner Assigned Confirmation
> Send after a runner accepts the job in the Phalanx chat.

```
🏃 RUNNER ASSIGNED

Job ID: {{request_id}}
Runner: {{runner_name}} | {{runner_phone}}
Pickup: {{pickup}}
ETA to pickup: {{eta}} min

Update portal status to ACTIVE.
```

---

### P4. Job Completed
> Runner sends this when delivery is done.

```
✅ JOB COMPLETE

Job ID: {{request_id}}
Runner: {{runner_name}}
Item delivered: {{description}}
Delivered to: {{dropoff}}
Time: {{completed_at}}

Update portal to COMPLETED.
```

---

### P5. Issue / Exception Alert
> Use when something goes wrong.

```
⚠️ EXCEPTION — ATTENTION NEEDED

Job ID: {{request_id}}
Issue: {{issue_description}}
Client: {{client_name}} | {{client_phone}}

Escalate immediately.
```

---

## MAKE.COM AUTOMATION NOTE

For templates P2 (DISPATCH NOW) and Client Template 2 (Payment Confirmed),
these fire automatically via the `flw-webhook` Edge Function.
You do not touch them manually.

For P3, P4, and P5 — these are manual Phalanx messages.
Copy, fill in the blanks, send.

Eventually automate P3 using the admin panel runner assignment trigger
to call a Make.com HTTP webhook that formats and sends this automatically.
