const assert = require('assert');

const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('🧪 Starting API Verification Suite...\n');

  // Helper for requests
  const req = async (path, options = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  };

  // 1. Health check
  console.log('1. Testing Root API endpoint...');
  const root = await fetch('http://localhost:5001/');
  const rootData = await root.json();
  assert.strictEqual(root.status, 200);
  assert.strictEqual(rootData.status, 'online');
  console.log('   ✅ Root endpoint responsive.');

  // 2. Unauthorized access blocked
  console.log('2. Testing Protected Route without Token (should return 401)...');
  const unauth = await req('/expenses');
  assert.strictEqual(unauth.status, 401);
  assert.strictEqual(unauth.data.success, false);
  console.log('   ✅ Unauthorized access blocked with 401:', unauth.data.message);

  // 3. Invalid token blocked
  console.log('3. Testing Protected Route with Invalid Token (should return 401)...');
  const invalidToken = await req('/expenses', {
    headers: { Authorization: 'Bearer bogus.token.here' },
  });
  assert.strictEqual(invalidToken.status, 401);
  console.log('   ✅ Invalid token rejected with 401.');

  // 4. Register a new user
  console.log('4. Testing User Registration...');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const registerRes = await req('/auth/register', {
    method: 'POST',
    body: {
      name: 'Test Student',
      email: testEmail,
      password: 'Password@123',
    },
  });
  assert.strictEqual(registerRes.status, 201);
  assert.ok(registerRes.data.token);
  assert.strictEqual(registerRes.data.user.email, testEmail);
  assert.strictEqual(registerRes.data.user.password, undefined); // Ensure password not exposed
  console.log('   ✅ Registered successfully. Token generated.');

  // 5. Test Duplicate User Registration (should return 400)
  console.log('5. Testing Duplicate Email Registration (should return 400)...');
  const dupRes = await req('/auth/register', {
    method: 'POST',
    body: {
      name: 'Test Student Duplicate',
      email: testEmail,
      password: 'Password@123',
    },
  });
  assert.strictEqual(dupRes.status, 400);
  console.log('   ✅ Duplicate registration rejected.');

  // 6. Login with Demo User
  console.log('6. Testing Login with Demo User (demo@spendtrack.com)...');
  const loginRes = await req('/auth/login', {
    method: 'POST',
    body: {
      email: 'demo@spendtrack.com',
      password: 'Demo@123',
    },
  });
  assert.strictEqual(loginRes.status, 200);
  assert.ok(loginRes.data.token);
  assert.strictEqual(loginRes.data.user.email, 'demo@spendtrack.com');
  const demoToken = loginRes.data.token;
  console.log('   ✅ Demo user logged in successfully.');

  // 7. Protected Route /api/auth/me
  console.log('7. Testing GET /api/auth/me with valid Bearer token...');
  const meRes = await req('/auth/me', {
    headers: { Authorization: `Bearer ${demoToken}` },
  });
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meRes.data.user.email, 'demo@spendtrack.com');
  console.log('   ✅ /api/auth/me verified user:', meRes.data.user.name);

  // 8. GET /api/expenses (List all for demo user)
  console.log('8. Testing GET /api/expenses...');
  const expensesRes = await req('/expenses', {
    headers: { Authorization: `Bearer ${demoToken}` },
  });
  assert.strictEqual(expensesRes.status, 200);
  assert.strictEqual(expensesRes.data.success, true);
  assert.ok(Array.isArray(expensesRes.data.data));
  console.log(`   ✅ Retrieved ${expensesRes.data.count} expenses for demo user.`);

  // 9. GET /api/expenses with category filter
  console.log('9. Testing Category Filter (?category=Food)...');
  const foodRes = await req('/expenses?category=Food', {
    headers: { Authorization: `Bearer ${demoToken}` },
  });
  assert.strictEqual(foodRes.status, 200);
  foodRes.data.data.forEach((item) => assert.strictEqual(item.category, 'Food'));
  console.log(`   ✅ Category filter returned ${foodRes.data.count} Food items.`);

  // 10. GET /api/expenses with search query
  console.log('10. Testing Search Filter (?search=Metro)...');
  const searchRes = await req('/expenses?search=Metro', {
    headers: { Authorization: `Bearer ${demoToken}` },
  });
  assert.strictEqual(searchRes.status, 200);
  assert.ok(searchRes.data.count >= 1);
  console.log(`   ✅ Search filter matched: ${searchRes.data.data[0].title}`);

  // 11. POST /api/expenses (Create new expense)
  console.log('11. Testing POST /api/expenses (Create)...');
  const newExpense = {
    title: 'Lab Notebook & Geometry Box',
    amount: 350.50,
    category: 'Education',
    date: '2026-11-17',
    notes: 'Bought for BCA semester lab viva',
  };
  const createRes = await req('/expenses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${demoToken}` },
    body: newExpense,
  });
  assert.strictEqual(createRes.status, 201);
  assert.strictEqual(createRes.data.data.title, newExpense.title);
  assert.strictEqual(createRes.data.data.amount, newExpense.amount);
  const createdId = createRes.data.data._id;
  console.log(`   ✅ Created expense successfully with ID: ${createdId}`);

  // 12. GET /api/expenses/:id (Read One)
  console.log('12. Testing GET /api/expenses/:id (Read One)...');
  const getOneRes = await req(`/expenses/${createdId}`, {
    headers: { Authorization: `Bearer ${demoToken}` },
  });
  assert.strictEqual(getOneRes.status, 200);
  assert.strictEqual(getOneRes.data.data._id, createdId);
  console.log('   ✅ Read one expense successfully.');

  // 13. PUT /api/expenses/:id (Update)
  console.log('13. Testing PUT /api/expenses/:id (Update)...');
  const updateRes = await req(`/expenses/${createdId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${demoToken}` },
    body: {
      title: 'Lab Notebook & Scientific Calculator',
      amount: 450.00,
      category: 'Education',
      date: '2026-11-17',
      notes: 'Updated item after lab instructor recommendation',
    },
  });
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateRes.data.data.title, 'Lab Notebook & Scientific Calculator');
  assert.strictEqual(updateRes.data.data.amount, 450.00);
  console.log('   ✅ Updated expense successfully.');

  // 14. Testing Cross-User Isolation (User B cannot access or modify User A's expense)
  console.log('14. Testing Cross-User Isolation (Security Check)...');
  const newUserToken = registerRes.data.token;
  const crossUserAccess = await req(`/expenses/${createdId}`, {
    headers: { Authorization: `Bearer ${newUserToken}` },
  });
  assert.strictEqual(crossUserAccess.status, 403);
  console.log('   ✅ Access forbidden (403) for non-owner user.');

  // 15. DELETE /api/expenses/:id (Delete)
  console.log('15. Testing DELETE /api/expenses/:id...');
  const deleteRes = await req(`/expenses/${createdId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${demoToken}` },
  });
  assert.strictEqual(deleteRes.status, 200);
  assert.strictEqual(deleteRes.data.id, createdId);
  console.log('   ✅ Deleted expense successfully.');

  // Verify it is gone
  const verifyGone = await req(`/expenses/${createdId}`, {
    headers: { Authorization: `Bearer ${demoToken}` },
  });
  assert.strictEqual(verifyGone.status, 404);
  console.log('   ✅ Verified deleted expense returns 404 Not Found.');

  console.log('\n🎉 ALL 15 API INTEGRATION TESTS PASSED PERFECTLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
