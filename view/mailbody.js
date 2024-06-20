const verifyAccount = (username, verifyLink) => {
    return (`
            <div style='background-color:gray; padding:10px; color:black;'>
                <h1>Hello!, ${ username } welcome to your personal finance tracker app</h1>
                <p>
                    Thank you for joining FinTrack, your trusted partner in personal finance management. 
                    To ensure the security of your account, please take a moment to verify your email address.
                </p>
                <p>
                    By verifying your account, you will unlock the full potential of FinTrack, including:
                    <br />* Expense Tracking: Easily monitor your spending habits.
                    <br />* Income Tracking: Easily monitor your incomes.
                    <br />* To get started, simply click the verification link sent to your email.
                </p>
                <a href=${ verifyLink } style='text-decoration:none;'>
                    <div style='background-color:black; color:white; padding:18px 10px; width: 150px; height: 40px;'>
                        Verify Account
                    </div>
                </a>
                <p>
                    * If you did not receive the email, check your spam folder or click here to resend the verification link.
                </p>
                <p>
                    Welcome aboard! Let’s take the first step towards achieving your financial dreams together.
                </p>
                <p>
                    Best regards,
                </p>
                <p>
                    The FinTrack Team
                </p>
            </div>
        `)
}


const resetPass = (username, resetPassLink) => {
    return (
        `
            <div>
                <h1>Hello ${ username }</h1>
                <p>Click the link below to reset your password.</p>
                <a href=${ resetPassLink}>Reset Password</a>
            </div>
        `
    )
}

const mailIncomeHistory = (user, calcTotal) => {
    return (
        `
            <div style="background-color: white; padding: 18px 10px; border-radius: 10px; box-shadow: 0px 8px 0px 2px rgba(0,0,0,0.2)">
                <h1>History on Income Transaction</h1>
                <table style="border-collapse:collapse;width:100%;">
                    <tr style="background-color:black; color:white;padding:10px 8px;">
                        <th>Transaction ID</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                    ${
                        user.map((value, index)=>{
                            return `
                            <tr style="border: 1px solid black; padding:10px; text-align:center">
                                <td>
                                    ${ value._id }
                                </td>
                                <td>
                                    ${ value.type }
                                </td>
                                <td>
                                    ${ value.category }
                                </td>
                                <td>
                                    ${ value.description }
                                </td>
                                <td>
                                    ${ value.amount }
                                </td>
                                <td>
                                    ${ value.date }
                                </td>
                            </tr>
                            
                            `
                            })
                    }
                </table>
                <table style="border-collapse:collapse;width:100%;>
                    <tr style="background-color:black; color:white;padding:10px 8px;">
                        <th>Grand Total</th>
                    </tr>
                    <tr>
                        <td>
                            ${calcTotal}
                        </td>
                    </tr>
                </table>
            </div>
        `
    )
}


const mailExpensesHistory = (calcTotal, user) => {
    return (
        `
            <div style="background-color: white; padding: 18px 10px; border-radius: 10px; box-shadow: 0px 8px 0px 2px rgba(0,0,0,0.2)">
                <h1>History on Income Transaction</h1>
                <table style="border-collapse:collapse;width:100%;">
                    <tr style="background-color:black; color:white;padding:10px 8px;">
                        <th>Transaction ID</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                    
                    ${
                        user.map((value, index)=>{
                            
                            return `                            
                                <tr style="border: 1px solid black; padding:10px; text-align:center">
                                    <td>
                                        ${ value._id }
                                    </td>
                                    <td>
                                        ${ value.type }
                                    </td>
                                    <td>
                                        ${ value.category }
                                    </td>
                                    <td>
                                        ${ value.description }
                                    </td>
                                    <td>
                                        ${ value.amount }
                                    </td>
                                    <td>
                                        ${ value.date }
                                    </td>
                                </tr>
                            `
                        })
                    }

                </table>
                <table style="border-collapse:collapse;width:100%;>
                    <tr style="background-color:black; color:white;padding:10px 8px;">
                        <th>Grand Total</th>
                    </tr>
                    <tr>
                        <td>
                            ${calcTotal}
                        </td>
                    </tr>
                </table>
            </div>
        `
    )
}

module.exports = {
    verifyAccount,
    resetPass,
    mailIncomeHistory,
    mailExpensesHistory
}